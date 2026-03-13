import express from 'express';
import { getDb } from '../utils/db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/nearby', authenticate, async (req, res) => {
  const { latitude, longitude, radius_km = 10, category } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    const db = getDb();
    // 1 degree is roughly 111km
    const latDelta = radius_km / 111;
    const lonDelta = radius_km / (111 * Math.cos(latitude * Math.PI / 180));

    const params = [
      parseFloat(latitude) - latDelta,
      parseFloat(latitude) + latDelta,
      parseFloat(longitude) - lonDelta,
      parseFloat(longitude) + lonDelta
    ];

    let categoryFilter = '';
    if (category) {
      params.push(category);
      categoryFilter = 'AND category = ?';
    }

    const result = await db.query(
      `SELECT
         id,
         name,
         category,
         phone,
         capacity_total,
         capacity_available,
         latitude,
         longitude
       FROM organizations
       WHERE is_active = 1
         AND latitude BETWEEN ? AND ?
         AND longitude BETWEEN ? AND ?
         ${categoryFilter}`,
      params,
    );

    // Calculate exact distance in JS
    const organizations = result.rows.map(org => {
      const dLat = (org.latitude - latitude) * Math.PI / 180;
      const dLon = (org.longitude - longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(latitude * Math.PI / 180) * Math.cos(org.latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance_m = 6371000 * c;
      return { ...org, distance_m };
    }).filter(org => org.distance_m <= radius_km * 1000)
      .sort((a, b) => a.distance_m - b.distance_m);

    res.json({ organizations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch nearby organizations' });
  }
});

export default router;

