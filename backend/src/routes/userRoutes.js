import express from 'express';
import { getDb } from '../utils/db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', async (req, res) => {
  try {
    const db = getDb();

    const userResult = await db.query(
      'SELECT id, name, email, phone, role, trust_score, total_reports, verified_reports FROM users WHERE id = ?',
      [req.user.id],
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rewardsResult = await db.query(
      `SELECT ur.id,
              ur.note,
              ur.created_at,
              r.title,
              r.description,
              r.coupon_code,
              r.sponsor,
              r.expires_at
       FROM user_rewards ur
       JOIN rewards r ON ur.reward_id = r.id
       WHERE ur.user_id = ?
       ORDER BY ur.created_at DESC`,
      [req.user.id],
    );

    res.json({
      user: userResult.rows[0],
      rewards: rewardsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load user dashboard' });
  }
});

export default router;

