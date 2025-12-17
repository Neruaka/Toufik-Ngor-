const { Client } = require("@elastic/elasticsearch");

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
        // Silencieux si ES n'est pas dispo (évite de spammer la console)
        // En prod on utiliserait un fallback (fichier log, etc.)
    }
};

module.exports = logToElasticsearch;