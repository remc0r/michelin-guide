const express = require("express");

const { getDb } = require("../db/mongo");

// Fallback data (si MongoDB non configuré) : on réutilise les mocks backend.
// NB: le mock frontend est en ESM et ne peut pas être require() facilement côté Jest.
const { restaurants: mockRestaurants } = require("../../data/mockData");

const router = express.Router();

function normalizeRestaurantDoc(doc) {
  if (!doc) return doc;
  // Normalisation pour coller aux props utilisées côté React
  const normalized = { ...doc };
  if (normalized.price_range && !normalized.priceRange) normalized.priceRange = normalized.price_range;
  if (normalized.priceRange && !normalized.price_range) normalized.price_range = normalized.priceRange;
  if (normalized.imageUrl && !normalized.image) normalized.image = normalized.imageUrl;
  if (normalized.image && !normalized.imageUrl) normalized.imageUrl = normalized.image;
  if (!normalized.gallery && (normalized.image || normalized.imageUrl)) {
    normalized.gallery = [normalized.image || normalized.imageUrl];
  }
  if (typeof normalized.slug !== "string" || !normalized.slug) {
    normalized.slug = slugify(normalized.name || normalized.id || "");
  }
  return normalized;
}

function slugify(s) {
  return String(s)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/restaurants
router.get("/restaurants", async (req, res) => {
  const { city, q } = req.query || {};

  try {
    const db = getDb();
    const filter = {};
    if (city) filter.city = String(city);
    if (q) {
      const rx = new RegExp(String(q), "i");
      filter.$or = [{ name: rx }, { chef: rx }, { cuisine: rx }, { city: rx }];
    }
    const docs = await db
      .collection("restaurants")
      .find(filter, { projection: { _id: 0 } })
      .limit(2000)
      .toArray();
    return res.json(docs.map(normalizeRestaurantDoc));
  } catch (e) {
    let list = [...mockRestaurants];
    if (city) list = list.filter((r) => r.city === String(city));
    if (q) {
      const qq = String(q).toLowerCase();
      list = list.filter((r) => `${r.name} ${r.chef} ${r.city} ${r.cuisine}`.toLowerCase().includes(qq));
    }
    return res.json(list.map(normalizeRestaurantDoc));
  }
});

// GET /api/restaurants/:slug
router.get("/restaurants/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const db = getDb();
    const doc = await db
      .collection("restaurants")
      .findOne({ slug: String(slug) }, { projection: { _id: 0 } });

    if (!doc) return res.status(404).json({ error: "Restaurant introuvable" });
    return res.json(normalizeRestaurantDoc(doc));
  } catch (e) {
    const doc = mockRestaurants.find((r) => r.slug === String(slug));
    if (!doc) return res.status(404).json({ error: "Restaurant introuvable" });
    return res.json(normalizeRestaurantDoc(doc));
  }
});

module.exports = router;


