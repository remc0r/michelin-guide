const { getDb } = require('../db/mongo');

// Mock data fallback
const mockActivities = [];

/**
 * Get activities by user IDs (for friend feed)
 */
async function getActivitiesByUserIds(userIds, { skip = 0, limit = 20 }) {
  try {
    const db = getDb();

    const [activities, total] = await Promise.all([
      db
        .collection('activities')
        .find({ userId: { $in: userIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db
        .collection('activities')
        .countDocuments({ userId: { $in: userIds } })
    ]);

    return { activities, total };
  } catch (error) {
    // Fallback to mock data
    const filteredActivities = mockActivities.filter(a =>
      userIds.includes(a.userId)
    );

    const total = filteredActivities.length;
    const activities = filteredActivities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);

    return { activities, total };
  }
}

/**
 * Get activities by a single user ID
 */
async function getActivitiesByUserId(userId, { skip = 0, limit = 20 }) {
  try {
    const db = getDb();

    const [activities, total] = await Promise.all([
      db
        .collection('activities')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db
        .collection('activities')
        .countDocuments({ userId })
    ]);

    return { activities, total };
  } catch (error) {
    // Fallback to mock data
    const userActivities = mockActivities.filter(a => a.userId === userId);

    const total = userActivities.length;
    const activities = userActivities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);

    return { activities, total };
  }
}

/**
 * Create a new activity
 */
async function createActivity(activityData) {
  try {
    const db = getDb();
    const result = await db
      .collection('activities')
      .insertOne(activityData);

    const createdActivity = await db
      .collection('activities')
      .findOne({ _id: result.insertedId });

    return createdActivity;
  } catch (error) {
    // Fallback to mock data
    const newActivity = {
      _id: `activity_${Date.now()}`,
      ...activityData
    };
    mockActivities.push(newActivity);
    return newActivity;
  }
}

module.exports = {
  getActivitiesByUserIds,
  getActivitiesByUserId,
  createActivity
};