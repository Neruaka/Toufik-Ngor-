const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Item routes OK" });
});

module.exports = router;