// ============================================
// SERVER.JS - API Backend avec Replica Set MongoDB
// ============================================
// Ce fichier gère l'API Express avec connexion au replica set
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============================================
// CONFIGURATION
// ============================================
const app = express();
const PORT = process.env.PORT || 5000;

// L'URI MongoDB inclut maintenant replicaSet=rs0
// Cela indique à Mongoose qu'il s'agit d'un replica set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin_password@mongodb-primary:27017/bibliotheque?authSource=admin&replicaSet=rs0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// VARIABLES GLOBALES POUR LES CONNEXIONS
// ============================================
let redisClient = null;
let elasticsearchConnected = false;

// ============================================
// CONNEXION MONGODB (avec Replica Set)
// ============================================
const connectMongoDB = async () => {
    try {
        // Options de connexion pour le replica set
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,  // Timeout de 10 secondes
            socketTimeoutMS: 45000,           // Timeout socket
        });
        console.log('✅ MongoDB connecté (Replica Set rs0)');
        
        // Affiche le statut du replica set
        const admin = mongoose.connection.db.admin();
        try {
            const status = await admin.command({ replSetGetStatus: 1 });
            console.log(`📊 Replica Set: ${status.set}`);
            status.members.forEach(member => {
                console.log(`   - ${member.name}: ${member.stateStr}`);
            });
        } catch (e) {
            console.log('⚠️ Impossible de récupérer le statut du replica set');
        }
    } catch (error) {
        console.error('❌ Erreur connexion MongoDB:', error.message);
        // Réessaie après 5 secondes
        setTimeout(connectMongoDB, 5000);
    }
};

// ============================================
// CONNEXION REDIS (non bloquante)
// ============================================
const connectRedis = async () => {
    try {
        const { createClient } = require('redis');
        redisClient = createClient({
            socket: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                connectTimeout: 5000
            }
        });
        
        redisClient.on('error', (err) => {
            console.log('⚠️ Redis erreur:', err.message);
        });
        
        await redisClient.connect();
        console.log('✅ Redis connecté');
    } catch (error) {
        console.log('⚠️ Redis non disponible:', error.message);
        redisClient = null;
    }
};

// ============================================
// CONNEXION ELASTICSEARCH (non bloquante)
// ============================================
const connectElasticsearch = async () => {
    try {
        const response = await fetch(`${ELASTICSEARCH_URL}/_cluster/health`, {
            signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
            elasticsearchConnected = true;
            console.log('✅ Elasticsearch connecté');
        }
    } catch (error) {
        console.log('⚠️ Elasticsearch non disponible:', error.message);
        elasticsearchConnected = false;
    }
};

// ============================================
// MODÈLES MONGOOSE
// ============================================
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    status: { type: String, enum: ['to_read', 'reading', 'finished'], default: 'to_read' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);

// ============================================
// MIDDLEWARE D'AUTHENTIFICATION
// ============================================
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

// ============================================
// ROUTES - AUTHENTIFICATION
// ============================================
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route racine pour confirmer que l'API tourne
app.get('/', (req, res) => {
    res.send('API Backend is running! 🚀');
});

// ============================================
// ROUTES - ITEMS (CRUD)
// ============================================
app.get('/items', authMiddleware, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/items', authMiddleware, async (req, res) => {
    try {
        const item = new Item({ ...req.body, userId: req.userId });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/items/:id', authMiddleware, async (req, res) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!item) {
            return res.status(404).json({ error: 'Item non trouvé' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/items/:id', authMiddleware, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!item) {
            return res.status(404).json({ error: 'Item non trouvé' });
        }
        res.json({ message: 'Item supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTE - HEALTH CHECK (avec infos replica set)
// ============================================
app.get('/health', async (req, res) => {
    // Statut MongoDB
    const mongoStatus = mongoose.connection.readyState === 1;
    
    // Statut Redis
    let redisStatus = false;
    if (redisClient) {
        try {
            await redisClient.ping();
            redisStatus = true;
        } catch (e) {
            redisStatus = false;
        }
    }
    
    // Statut Elasticsearch
    let esStatus = false;
    try {
        const response = await fetch(`${ELASTICSEARCH_URL}/_cluster/health`, {
            signal: AbortSignal.timeout(2000)
        });
        esStatus = response.ok;
    } catch (e) {
        esStatus = false;
    }
    
    // Infos Replica Set
    let replicaSetInfo = null;
    if (mongoStatus) {
        try {
            const admin = mongoose.connection.db.admin();
            const status = await admin.command({ replSetGetStatus: 1 });
            replicaSetInfo = {
                name: status.set,
                members: status.members.map(m => ({
                    name: m.name,
                    state: m.stateStr,
                    health: m.health === 1 ? 'OK' : 'DOWN'
                }))
            };
        } catch (e) {
            replicaSetInfo = { error: 'Impossible de récupérer le statut' };
        }
    }
    
    const allHealthy = mongoStatus && redisStatus && esStatus;
    
    res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'OK' : 'DEGRADED',
        message: allHealthy ? 'Tous les services sont opérationnels' : 'Certains services ne sont pas disponibles',
        details: {
            mongodb: mongoStatus,
            redis: redisStatus,
            elasticsearch: esStatus
        },
        replicaSet: replicaSetInfo
    });
});

// ============================================
// ROUTE - TEST REPLICA SET
// ============================================
app.get('/replica-test', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'MongoDB non connecté' });
        }
        
        const admin = mongoose.connection.db.admin();
        const status = await admin.command({ replSetGetStatus: 1 });
        
        res.json({
            replicaSetName: status.set,
            members: status.members.map(m => ({
                id: m._id,
                name: m.name,
                state: m.stateStr,
                health: m.health === 1 ? 'OK' : 'DOWN',
                uptime: m.uptime,
                lastHeartbeat: m.lastHeartbeat
            })),
            ok: status.ok === 1
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTE - TEST CACHE REDIS
// ============================================
app.get('/cache-test', async (req, res) => {
    if (!redisClient) {
        return res.json({ message: 'Redis non disponible', visits: 'N/A' });
    }
    try {
        const visits = await redisClient.incr('visits');
        res.json({ message: 'Cache Redis fonctionne !', visits: visits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const startServer = async () => {
    // Connexions aux services
    await connectMongoDB();
    await connectRedis();
    await connectElasticsearch();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`📍 Replica test: http://localhost:${PORT}/replica-test`);
    });
};

startServer();
