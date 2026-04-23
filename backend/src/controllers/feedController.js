const feedService = require('../services/feedService');

/**
 * Get activity feed for friends only
 * GET /api/feed?page=&limit=
 */
async function getFeed(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const feed = await feedService.getFeed(req.userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    return res.json(feed);
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's own activities
 * GET /api/feed/own
 */
async function getOwnActivities(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const activities = await feedService.getOwnActivities(req.userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    return res.json(activities);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeed,
  getOwnActivities
};