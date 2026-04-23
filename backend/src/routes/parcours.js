const express = require('express');

const router = express.Router();

router.get('/parcours', async (req, res) => {
  const { city = null, group_type = null, moment = null } = req.query;

  res.json({
    city,
    group_type,
    moment,
    recommendations: []
  });
});

module.exports = router;

