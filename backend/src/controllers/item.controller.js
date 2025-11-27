const itemService = require("../services/item.service");

const create = async (req, res) => {
    const userId = req.user.userId;
    const data = req.body;

    const result = await itemService.createItem(data, userId);

    return res.status(result.statusCode).json(result);
};

const getAll = async (req, res) => {
    const userId = req.user.userId;
    const filters = {
        status: req.query.status || null
    };

    const result = await itemService.getAllItems(userId, filters);

    return res.status(result.statusCode).json(result);
};

const getOne = async (req, res) => {
    const userId = req.user.userId;
    const itemId = req.params.id;

    const result = await itemService.getItemById(itemId, userId);

    return res.status(result.statusCode).json(result);
};

const update = async (req, res) => {
    const userId = req.user.userId;
    const itemId = req.params.id;
    const updates = req.body;

    const result = await itemService.updateItem(itemId, userId, updates);

    return res.status(result.statusCode).json(result);
};

const remove = async (req, res) => {
    const userId = req.user.userId;
    const itemId = req.params.id;

    const result = await itemService.deleteItem(itemId, userId);

    return res.status(result.statusCode).json(result);
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove
};