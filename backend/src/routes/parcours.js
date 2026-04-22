const express = require("express");

const { getParcoursRecommendations } = require("../../data/mockData");
const { getDb } = require("../db/mongo");

const router = express.Router();

/**
 * GET /api/parcours?city=&group_type=&moment=
 * Renvoie une sélection mockée, filtrée par ville, avec randomisation légère.
 */
router.get("/parcours", async (req, res) => {
  const { city = "", group_type = "", moment = "" } = req.query || {};

  const includeHotels = String(group_type).toLowerCase() === "voyage";

  const cityStr = String(city);
  const cityNormalized = cityStr.trim();

  // 1) Tentative MongoDB (si configuré)
  // Collections attendues: restaurants / hotels (voir scripts/seedMongo.js)
  // En cas d'échec (Mongo absent), on fallback sur les mocks.
  let data;
  try {
    const db = getDb();
    const restaurants = await db
      .collection("restaurants")
      .find(
        { city: { $regex: new RegExp(`^${escapeRegExp(cityNormalized)}$`, "i") } },
        { projection: { _id: 0 } }
      )
      .toArray();

    const hotels = includeHotels
      ? await db
          .collection("hotels")
          .find(
            { city: { $regex: new RegExp(`^${escapeRegExp(cityNormalized)}$`, "i") } },
            { projection: { _id: 0 } }
          )
          .toArray()
      : [];

    data = {
      restaurants: pickRandom(restaurants, 3),
      hotels: includeHotels ? pickRandom(hotels, 2) : [],
    };
  } catch (e) {
    data = getParcoursRecommendations({
      city: cityStr,
      includeHotels,
    });
  }

  res.json({
    city: cityStr,
    group_type: String(group_type),
    moment: String(moment),
    restaurants: data.restaurants,
    hotels: data.hotels,
  });
});

/**
 * Échappe une string pour l'inclure dans une RegExp.
 * @param {string} s
 */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Prend N éléments au hasard dans un tableau (sans muter), Fisher–Yates partiel.
 * @template T
 * @param {T[]} arr
 * @param {number} count
 * @returns {T[]}
 */
function pickRandom(arr, count) {
  const a = Array.isArray(arr) ? [...arr] : [];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, count));
}

module.exports = router;

