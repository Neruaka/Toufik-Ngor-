const Item = require("../models/item.model");

// CREATE - créer un livre
const createItem = async (data, userId) => {
    try {
        const newItem = await Item.create({
            ...data,
            userId
        });

        return {
            error: false,
            message: "Livre ajouté avec succès",
            statusCode: 201,
            data: newItem
        };

    } catch (err) {
        return {
            error: true,
            message: "Erreur lors de la création du livre",
            statusCode: 500
        };
    }
};

// READ ALL - récupérer tous les livres d'un utilisateur
const getAllItems = async (userId, filters = {}) => {
    try {
        const query = { userId };

        // filtre par statut si fourni
        if (filters.status) {
            query.status = filters.status;
        }

        const items = await Item.find(query).sort({ createdAt: -1 });

        return {
            error: false,
            message: "Livres récupérés avec succès",
            statusCode: 200,
            data: items
        };

    } catch (err) {
        return {
            error: true,
            message: "Erreur lors de la récupération des livres",
            statusCode: 500
        };
    }
};

// READ ONE - récupérer un livre par son id
const getItemById = async (itemId, userId) => {
    try {
        const item = await Item.findOne({ _id: itemId, userId });

        if (!item) {
            return {
                error: true,
                message: "Livre non trouvé",
                statusCode: 404
            };
        }

        return {
            error: false,
            message: "Livre récupéré avec succès",
            statusCode: 200,
            data: item
        };

    } catch (err) {
        return {
            error: true,
            message: "Erreur lors de la récupération du livre",
            statusCode: 500
        };
    }
};

// UPDATE - modifier un livre
const updateItem = async (itemId, userId, updates) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: itemId, userId },
            { ...updates },
            { new: true }  // retourne le document modifié
        );

        if (!item) {
            return {
                error: true,
                message: "Livre non trouvé",
                statusCode: 404
            };
        }

        return {
            error: false,
            message: "Livre mis à jour avec succès",
            statusCode: 200,
            data: item
        };

    } catch (err) {
        return {
            error: true,
            message: "Erreur lors de la mise à jour du livre",
            statusCode: 500
        };
    }
};

// DELETE - supprimer un livre
const deleteItem = async (itemId, userId) => {
    try {
        const item = await Item.findOneAndDelete({ _id: itemId, userId });

        if (!item) {
            return {
                error: true,
                message: "Livre non trouvé",
                statusCode: 404
            };
        }

        return {
            error: false,
            message: "Livre supprimé avec succès",
            statusCode: 200,
            data: item
        };

    } catch (err) {
        return {
            error: true,
            message: "Erreur lors de la suppression du livre",
            statusCode: 500
        };
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};