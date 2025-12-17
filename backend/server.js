const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const redis = require("redis");
const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const itemRoutes = require("./src/routes/item.routes");

const app = express();

// ============================================================
// CONFIGURATION (via variables d'environnement)
// ============================================================

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:admin_password@mongodb:27017/bibliotheque?authSource=admin";
const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST || "elasticsearch";
const ELASTICSEARCH_PORT = process.env.ELASTICSEARCH_PORT || 9200;

// ============================================================
// CLIENTS REDIS & ELASTICSEARCH
// ============================================================

let redisClient = null;

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            socket: {
                host: REDIS_HOST,
                port: parseInt(REDIS_PORT),
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.log("❌ Redis: abandon après 3 tentatives");
                        return false;
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on("error", (err) => {
            // Silencieux après la première erreur pour éviter le spam
        });

        await redisClient.connect();
        console.log("✅ Redis connecté");
    } catch (error) {
        console.error("❌ Redis non disponible (non critique):", error.message);
        redisClient = null;
    }
};

// Client Elasticsearch
const esClient = new Client({
    node: `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`
});

const logToElasticsearch = async (message, level = "INFO") => {
    try {
        await esClient.index({
            index: "bibliotheque-logs",
            document: {
                timestamp: new Date().toISOString(),
                level: level,
                message: message,
                service: "backend-api"
            }
        });
    } catch (error) {
        // Silencieux si ES n'est pas dispo
    }
};

// ============================================================
// CONNEXION MONGODB
// ============================================================

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB connecté");
        await logToElasticsearch("MongoDB connecté avec succès");
    } catch (error) {
        console.error("❌ Erreur connexion MongoDB:", error.message);
        process.exit(1);
    }
};

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    await logToElasticsearch(`${req.method} ${req.path}`);
    next();
});

// ============================================================
// ROUTES
// ============================================================

app.get("/", (req, res) => {
    res.json({
        message: "API Bibliothèque opérationnelle !",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            cacheTest: "/cache-test",
            auth: "/auth",
            items: "/items"
        }
    });
});

// HEALTH CHECK
app.get("/health", async (req, res) => {
    const status = {
        mongodb: false,
        redis: false,
        elasticsearch: false
    };

    // Test MongoDB
    try {
        if (mongoose.connection.readyState === 1) {
            status.mongodb = true;
        }
    } catch (error) {
        console.error("Health check MongoDB failed:", error.message);
    }

    // Test Redis
    try {
        if (redisClient && redisClient.isOpen) {
            await redisClient.ping();
            status.redis = true;
        }
    } catch (error) {
        console.error("Health check Redis failed:", error.message);
    }

    // Test Elasticsearch
    try {
        const pingResult = await esClient.ping();
        if (pingResult) {
            status.elasticsearch = true;
        }
    } catch (error) {
        // ES pas dispo
    }

    await logToElasticsearch(`Health check: ${JSON.stringify(status)}`);

    if (status.mongodb) {
        return res.status(200).json({
            status: "OK",
            message: "Tous les services critiques sont opérationnels",
            details: status
        });
    } else {
        return res.status(503).json({
            status: "ERROR",
            message: "La base de données n'est pas accessible",
            details: status
        });
    }
});

// TEST CACHE REDIS
app.get("/cache-test", async (req, res) => {
    try {
        if (!redisClient || !redisClient.isOpen) {
            return res.status(503).json({
                error: "Redis n'est pas disponible",
                hint: "Vérifiez que le service Redis est démarré"
            });
        }

        const visits = await redisClient.incr("api:visits");
        await logToElasticsearch(`Cache test - Visite #${visits}`);

        res.json({
            message: "Cache Redis fonctionnel ! 🚀",
            visits: visits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes métier
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

const startServer = async () => {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        logToElasticsearch(`Serveur démarré sur le port ${PORT}`);
    });
};

startServer();
