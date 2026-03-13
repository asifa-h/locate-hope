import express from 'express';
import { getDb } from '../utils/db.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/stats', async (req, res) => {
  try {
    const db = getDb();
    const reportsStats = await db.query(
      `SELECT status, COUNT(*) as count FROM reports GROUP BY status`
    );
    const urgencyStats = await db.query(
      `SELECT urgency, COUNT(*) as count FROM reports GROUP BY urgency`
    );
    const dailyStats = await db.query(
      `SELECT date(created_at) as date, COUNT(*) as count FROM reports GROUP BY date(created_at) ORDER BY date DESC LIMIT 7`
    );
    const userStats = await db.query(
      `SELECT COUNT(*) as total_users FROM users WHERE role = 'user'`
    );
    const ngoStats = await db.query(
      `SELECT COUNT(*) as total_ngos FROM users WHERE role = 'ngo'`
    );

    res.json({
      reportsByStatus: reportsStats.rows,
      reportsByUrgency: urgencyStats.rows,
      dailyReports: dailyStats.rows,
      totalUsers: userStats.rows[0].total_users,
      totalNgos: ngoStats.rows[0].total_ngos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT r.*, u.name AS user_name, u.email AS user_email
       FROM reports r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`,
    );
    res.json({ reports: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
});

router.post('/reports/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { verified, assignedNgoId, rejectionReason } = req.body;

  try {
    const db = getDb();
    const reportResult = await db.query(
      'SELECT id, user_id, status FROM reports WHERE id = ?',
      [id],
    );

    if (!reportResult.rows.length) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reportResult.rows[0];

    let newStatus = report.status;
    if (verified === true) {
      newStatus = assignedNgoId ? 'assigned' : 'approved';
    } else if (verified === false) {
      newStatus = 'rejected';
    }

    await db.query(
      `UPDATE reports
       SET status = ?,
           assigned_ngo_id = ?,
           rejection_reason = ?,
           verified_at = CASE WHEN ? THEN datetime('now') ELSE NULL END
       WHERE id = ?`,
      [
        newStatus,
        assignedNgoId || null,
        rejectionReason || null,
        verified === true ? 1 : 0,
        id,
      ],
    );

    if (verified === true) {
      await db.query(
        `UPDATE users
         SET trust_score = trust_score + 10,
             verified_reports = verified_reports + 1
         WHERE id = ?`,
        [report.user_id],
      );
    } else if (verified === false) {
      await db.query(
        `UPDATE users
         SET trust_score = MAX(trust_score - 5, 0)
         WHERE id = ?`,
        [report.user_id],
      );
    }

    res.json({ message: 'Report verification updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify report' });
  }
});

router.get('/organizations', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      'SELECT * FROM organizations ORDER BY name ASC',
    );
    res.json({ organizations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch organizations' });
  }
});

router.post('/organizations', async (req, res) => {
  const {
    name,
    category,
    phone,
    capacityTotal,
    capacityAvailable,
    latitude,
    longitude,
  } = req.body;

  if (!name || !category || !latitude || !longitude) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

    try {
    const db = getDb();
    const insertResult = await db.query(
      `INSERT INTO organizations
       (name, category, phone, capacity_total, capacity_available, latitude, longitude, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name,
        category,
        phone || null,
        capacityTotal || 0,
        capacityAvailable || 0,
        latitude,
        longitude,
      ],
    );

    const result = await db.query(
      'SELECT * FROM organizations WHERE id = ?',
      [insertResult.lastID],
    );

    res.status(201).json({ organization: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create organization' });
  }
});

router.patch('/organizations/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    phone,
    capacityTotal,
    capacityAvailable,
    isActive,
  } = req.body;

  try {
    const db = getDb();
    await db.query(
      `UPDATE organizations
       SET name = COALESCE(?, name),
           category = COALESCE(?, category),
           phone = COALESCE(?, phone),
           capacity_total = COALESCE(?, capacity_total),
           capacity_available = COALESCE(?, capacity_available),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name || null,
        category || null,
        phone || null,
        capacityTotal,
        capacityAvailable,
        isActive,
        id,
      ],
    );

    const result = await db.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ organization: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update organization' });
  }
});

router.get('/rewards', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      'SELECT * FROM rewards ORDER BY created_at DESC',
    );
    res.json({ rewards: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
});

router.post('/rewards', async (req, res) => {
  const {
    title,
    description,
    couponCode,
    sponsor,
    expiresAt,
    totalAvailable,
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const db = getDb();
    const insertResult = await db.query(
      `INSERT INTO rewards
       (title, description, coupon_code, sponsor, expires_at, total_available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        couponCode || null,
        sponsor || null,
        expiresAt || null,
        totalAvailable || null,
      ],
    );

    const result = await db.query(
      'SELECT * FROM rewards WHERE id = ?',
      [insertResult.lastID],
    );

    res.status(201).json({ reward: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create reward' });
  }
});

router.post('/rewards/:id/send', async (req, res) => {
  const { id } = req.params;
  const { userId, note } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const db = getDb();
    const rewardResult = await db.query(
      'SELECT * FROM rewards WHERE id = ?',
      [id],
    );

    if (!rewardResult.rows.length) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    await db.query(
      `INSERT INTO user_rewards
       (user_id, reward_id, note)
       VALUES (?, ?, ?)`,
      [
        userId,
        id,
        note ||
          'Thank you for helping the community through LocateHope. Your verified report helped someone in need. Please enjoy this reward as a token of appreciation.',
      ],
    );

    res.json({ message: 'Reward sent to user' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reward' });
  }
});

export default router;

