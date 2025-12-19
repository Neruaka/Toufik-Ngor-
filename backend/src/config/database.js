const mongoose = require('mongoose');
const { createClient } = require('redis');

// Variables globales pour l'état
let redisClient = null;
let elasticsearchConnected = false;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin_password@mongodb-primary:27017/bibliotheque?authSource=admin&replicaSet=rs0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200';

const connectDB = async () => {
    // 1. MongoDB (Replica Set)
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB connecté (Replica Set rs0)');
        
        // Petit check du statut (optionnel mais utile pour le debug)
        try {
            const admin = mongoose.connection.db.admin();
            const status = await admin.command({ replSetGetStatus: 1 });
            console.log(`📊 Cluster: ${status.set} | Mon état: ${status.myState === 1 ? 'PRIMARY' : 'SECONDARY'}`);
        } catch (e) { /* Ignorer si pas encore prêt */ }

    } catch (error) {
        console.error('❌ Erreur MongoDB:', error.message);
        // Retry logic could go here
    }

    // 2. Redis
    try {
        redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
        redisClient.on('error', err => console.log('⚠️ Redis Client Error', err.message));
        await redisClient.connect();
        console.log('✅ Redis connecté');
    } catch (error) {
        console.log('⚠️ Redis non disponible');
    }

    // 3. Elasticsearch
    try {
        const response = await fetch(`${ELASTICSEARCH_URL}/_cluster/health`, { signal: AbortSignal.timeout(2000) });
        if (response.ok) {
            elasticsearchConnected = true;
            console.log('✅ Elasticsearch connecté');
        }
    } catch (error) {
        console.log('⚠️ Elasticsearch non disponible');
    }
};

// On exporte les clients pour pouvoir les utiliser ailleurs (ex: dans le health check)
module.exports = { 
    connectDB, 
    getRedisClient: () => redisClient,
    isElasticConnected: () => elasticsearchConnected
};