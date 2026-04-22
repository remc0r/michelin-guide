/* eslint-disable no-console */
const path = require("path");
const dotenv = require("dotenv");

const { MongoClient } = require("mongodb");
const { restaurants, hotels } = require("../data/mockData");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function main() {
  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;

  if (!mongoUrl) throw new Error("MONGO_URL manquant (backend/.env)");
  if (!dbName) throw new Error("DB_NAME manquant (backend/.env)");

  const client = new MongoClient(mongoUrl);
  await client.connect();

  try {
    const db = client.db(dbName);
    const restaurantsCol = db.collection("restaurants");
    const hotelsCol = db.collection("hotels");

    // Idempotent: on remplace entièrement les collections
    await restaurantsCol.deleteMany({});
    await hotelsCol.deleteMany({});

    function slugify(s) {
      return String(s)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const seededRestaurants = restaurants.map((r) => {
      // Normaliser le schéma pour le frontend
      const priceRange = r.priceRange || r.price_range;
      const image = r.image || r.imageUrl;
      const slug = r.slug || slugify(r.name || r.id);
      return {
        ...r,
        slug,
        priceRange,
        image,
        gallery: r.gallery || (image ? [image] : []),
        chef: r.chef || "",
        neighborhood: r.neighborhood || "",
        rating: typeof r.rating === "number" ? r.rating : 4.6,
        reviews: typeof r.reviews === "number" ? r.reviews : 500,
        tags: Array.isArray(r.tags) ? r.tags : [],
        mood: Array.isArray(r.mood) ? r.mood : [],
        price: typeof r.price === "number" ? r.price : undefined,
      };
    });

    if (seededRestaurants.length) {
      await restaurantsCol.insertMany(seededRestaurants);
    }
    if (hotels.length) {
      await hotelsCol.insertMany(hotels.map((h) => ({ ...h })));
    }

    // Index utiles pour les filtres
    await restaurantsCol.createIndex({ city: 1 });
    await restaurantsCol.createIndex({ slug: 1 }, { unique: true });
    await restaurantsCol.createIndex({ stars: -1 });
    await hotelsCol.createIndex({ city: 1 });
    await hotelsCol.createIndex({ stars_hotel: -1 });

    console.log(
      `Seed OK: restaurants=${seededRestaurants.length}, hotels=${hotels.length} (db=${dbName})`
    );
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

