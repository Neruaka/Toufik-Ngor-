const redis = require('redis');

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            socket: {
                host: REDIS_HOST,
                port: parseInt(REDIS_PORT)
            }
        });

        // Gestion des erreurs Redis (évite les crashs)
        redisClient.on("error", (err) => {
            console.error("❌ Redis Error:", err.message);
        });

        await redisClient.connect();
        console.log("✅ Redis connecté");
    } catch (error) {
        console.error("❌ Impossible de se connecter à Redis:", error.message);
        // On ne crash pas le serveur si Redis est down
        // Le health check indiquera que Redis n'est pas disponible
    }
};

module.exports = connectRedis;