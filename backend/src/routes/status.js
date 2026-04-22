const express = require("express");
const crypto = require("crypto");

const { getDb } = require("../db/mongo");

const router = express.Router();

/**
 * Construit un objet StatusCheck conforme à la version Python.
 * @param {{client_name: string}} input
 * @returns {{id: string, client_name: string, timestamp: string}}
 */
function buildStatusCheck(input) {
  return {
    id: crypto.randomUUID(),
    client_name: input.client_name,
    timestamp: new Date().toISOString(),
  };
}

// POST /api/status
router.post("/status", async (req, res, next) => {
  try {
    const { client_name } = req.body || {};
    if (!client_name || typeof client_name !== "string") {
      return res.status(400).json({ error: "client_name est requis" });
    }

    const doc = buildStatusCheck({ client_name });
    try {
      await getDb().collection("status_checks").insertOne(doc);
    } catch (e) {
      return res.status(503).json({
        error:
          "MongoDB non configuré. Configurez backend/.env (MONGO_URL, DB_NAME) pour activer /api/status.",
      });
    }
    return res.json(doc);
  } catch (e) {
    return next(e);
  }
});

// GET /api/status
router.get("/status", async (req, res, next) => {
  try {
    let docs;
    try {
      docs = await getDb()
        .collection("status_checks")
        .find({}, { projection: { _id: 0 } })
        .limit(1000)
        .toArray();
    } catch (e) {
      return res.status(503).json({
        error:
          "MongoDB non configuré. Configurez backend/.env (MONGO_URL, DB_NAME) pour activer /api/status.",
      });
    }

    return res.json(docs);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

