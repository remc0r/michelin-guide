const { MongoClient } = require("mongodb");

let client;
let db;

/**
 * Connexion MongoDB (singleton) — variables attendues: MONGO_URL, DB_NAME.
 * @returns {Promise<{client: MongoClient, db: import('mongodb').Db}>}
 */
async function connectToMongo() {
  if (client && db) return { client, db };

  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  if (!mongoUrl) throw new Error("MONGO_URL manquant (backend/.env)");
  if (!dbName) throw new Error("DB_NAME manquant (backend/.env)");

  client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db(dbName);

  return { client, db };
}

/**
 * @returns {import('mongodb').Db}
 */
function getDb() {
  if (!db) throw new Error("MongoDB non connecté. Appelez connectToMongo() avant.");
  return db;
}

module.exports = { connectToMongo, getDb };

