const express = require('express');
const { isMongoConnected } = require('../db/mongo');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    ok: true,
    mongoConnected: isMongoConnected()
  });
});

module.exports = router;

