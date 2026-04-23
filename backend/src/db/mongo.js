const { MongoClient } = require('mongodb');

let client;
let db;
let connectingPromise;

async function connectToMongo() {
  if (db) {
    return { client, db };
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;

  if (!mongoUrl || !dbName) {
    throw new Error('MONGO_URL and DB_NAME are required to connect to MongoDB');
  }

  connectingPromise = (async () => {
    const mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();

    client = mongoClient;
    db = mongoClient.db(dbName);

    return { client, db };
  })();

  try {
    return await connectingPromise;
  } finally {
    connectingPromise = undefined;
  }
}

function getDb() {
  if (!db) {
    throw new Error('MongoDB is not connected');
  }

  return db;
}

function isMongoConnected() {
  return Boolean(db);
}

async function closeMongoConnection() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

module.exports = {
  connectToMongo,
  getDb,
  isMongoConnected,
  closeMongoConnection
};

