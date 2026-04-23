const express = require('express');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.get('/restaurants', async (req, res, next) => {
  try {
    const { city, q } = req.query;
    const filters = {};

    if (city) {
      filters.city = String(city);
    }

    if (q) {
      filters.$or = [
        { name: { $regex: String(q), $options: 'i' } },
        { cuisine: { $regex: String(q), $options: 'i' } },
        { location: { $regex: String(q), $options: 'i' } }
      ];
    }

    try {
      const db = getDb();
      const restaurants = await db.collection('restaurants').find(filters).toArray();
      return res.json(restaurants);
    } catch (error) {
      // Keep API stable when Mongo is unavailable.
      return res.json([]);
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/restaurants/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    try {
      const db = getDb();
      const restaurant = await db.collection('restaurants').findOne({ slug: String(slug) });

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }

      return res.json(restaurant);
    } catch (error) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

