const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const { connectToMongo } = require("./src/db/mongo");
const apiRouter = require("./src/routes");

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 8000);

/**
 * Construit l'application Express.
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();

  const corsOriginsRaw = process.env.CORS_ORIGINS || "*";
  const corsOrigins = corsOriginsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      credentials: true,
      origin: corsOrigins.includes("*") ? true : corsOrigins,
    })
  );
  app.use(express.json());

  // Routes API (préfixe /api comme la version FastAPI)
  app.use("/api", apiRouter);

  // 404 JSON (utile côté frontend)
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler JSON
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Ne pas exposer de stack en prod
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal Server Error" });
  });

  return app;
}

async function main() {
  try {
    await connectToMongo();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      "MongoDB non configuré (backend/.env). Les endpoints /api/status seront indisponibles."
    );
  }

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

// Lancement direct
if (require.main === module) {
  main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}

module.exports = { createApp };

