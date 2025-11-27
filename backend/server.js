const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/database");

const authRoutes = require("./src/routes/auth.routes");
const itemRoutes = require("./src/routes/item.routes");

const app = express();

// middlewares globaux
app.use(cors());
app.use(express.json());

// connexion à la BDD
connectDB();

const PORT = process.env.PORT || 5000;

// route de test
app.get("/", (req, res) => {
    res.json({ message: "API Bibliothèque opérationnelle !" });
});

// routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});