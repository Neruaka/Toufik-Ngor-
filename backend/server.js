const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import de la config DB
const { connectDB, getRedisClient, isElasticConnected } = require("./src/config/database");

// Import de vos routes existantes
const authRoutes = require("./src/routes/auth.routes");
const itemRoutes = require("./src/routes/item.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Connexion aux bases de données (Mongo, Redis, Elastic)
connectDB();

// ==========================================
// ROUTE HEALTH (Indispensable pour Docker)
// ==========================================
app.get('/health', async (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1;
    const redisStatus = getRedisClient()?.isOpen || false;
    const esStatus = isElasticConnected();

    // Récupération infos Replica Set
    let replicaSetInfo = null;
    if (mongoStatus) {
        try {
            const admin = mongoose.connection.db.admin();
            const status = await admin.command({ replSetGetStatus: 1 });
            replicaSetInfo = { set: status.set, members: status.members.length };
        } catch (e) {}
    }

    const allHealthy = mongoStatus; // On considère sain si au moins la DB marche

    res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'OK' : 'DEGRADED',
        services: {
            mongodb: mongoStatus ? 'UP' : 'DOWN',
            redis: redisStatus ? 'UP' : 'DOWN',
            elasticsearch: esStatus ? 'UP' : 'DOWN'
        },
        replicaSet: replicaSetInfo
    });
});

// ==========================================
// VOS ROUTES MÉTIERS
// ==========================================
app.get("/", (req, res) => {
    res.json({ message: "API Bibliothèque opérationnelle ! 📚" });
});

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
})