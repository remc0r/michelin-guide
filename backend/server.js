const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const apiRoutes = require('./src/routes');
const { connectToMongo } = require('./src/db/mongo');

dotenv.config();

function parseCorsOrigins() {
  const origins = process.env.CORS_ORIGINS;

  if (!origins) {
    return true;
  }

  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isPrivateNetworkHost(hostname) {
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname.startsWith('10.')
    || hostname.startsWith('192.168.')
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
}

function createCorsOriginValidator() {
  const allowedOrigins = parseCorsOrigins();

  if (allowedOrigins === true) {
    return true;
  }

  return (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Dev convenience: allow LAN access to the frontend (port 3000) without hardcoding every local IP.
    if (process.env.NODE_ENV !== 'production') {
      try {
        const originUrl = new URL(origin);
        if (originUrl.port === '3000' && isPrivateNetworkHost(originUrl.hostname)) {
          callback(null, true);
          return;
        }
      } catch (error) {
        // Ignore malformed Origin and reject below.
      }
    }

    callback(new Error('Origin not allowed by CORS'));
  };
}

function createApp() {
  const app = express();

  app.use(cors({ origin: createCorsOriginValidator() }));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use('/api', apiRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';

    return res.status(statusCode).json({ error: message });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const port = Number(process.env.PORT) || 8000;

  try {
    await connectToMongo();
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB unavailable, using repository fallbacks');
  }

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  startServer
};

