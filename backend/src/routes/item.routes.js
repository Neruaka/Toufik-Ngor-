const express = require("express");
const router = express.Router();

const itemController = require("../controllers/item.controller");
const authenticateUser = require("../middlewares/auth.middleware");
const { validateWithJoi } = require("../middlewares/validation.middlewares");
const { itemCreateSchema, itemUpdateSchema } = require("../dtos/item.dto");

// toutes les routes sont protégées (faut être connecté)
router.use(authenticateUser);

// POST /items - créer un livre
router.post("/", validateWithJoi(itemCreateSchema), itemController.create);

// GET /items - récupérer tous ses livres
router.get("/", itemController.getAll);

// GET /items/:id - récupérer un livre
router.get("/:id", itemController.getOne);

// PATCH /items/:id - modifier un livre
router.patch("/:id", validateWithJoi(itemUpdateSchema), itemController.update);

// DELETE /items/:id - supprimer un livre
router.delete("/:id", itemController.remove);

module.exports = router;