const express = require("express");

const statusRoutes = require("./status");
const parcoursRoutes = require("./parcours");
const restaurantsRoutes = require("./restaurants");
const authRoutes = require("./auth");
const friendsRoutes = require("./friends");
const feedRoutes = require("./feed");
const reservationsRoutes = require("./reservations");
const reviewsRoutes = require("./reviews");

const router = express.Router();

// Équivalent de GET /api/ (FastAPI)
router.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});

router.use(statusRoutes);
router.use(parcoursRoutes);
router.use(restaurantsRoutes);
router.use("/auth", authRoutes);
router.use("/friends", friendsRoutes);
router.use("/feed", feedRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/reviews", reviewsRoutes);

module.exports = router;

