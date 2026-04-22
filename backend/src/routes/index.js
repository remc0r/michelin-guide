const express = require("express");

const statusRoutes = require("./status");
const parcoursRoutes = require("./parcours");
const restaurantsRoutes = require("./restaurants");

const router = express.Router();

// Équivalent de GET /api/ (FastAPI)
router.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});

router.use(statusRoutes);
router.use(parcoursRoutes);
router.use(restaurantsRoutes);

module.exports = router;

