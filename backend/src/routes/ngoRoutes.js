import express from 'express';
import { getDb } from '../utils/db.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, requireRole('ngo'));

router.get('/reports', async (req, res) => {
  const { status = 'pending' } = req.query;

  try {
    const db = getDb();
    const result = await db.query(
      `SELECT r.*, u.name AS user_name, u.phone AS user_phone
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE (r.status = ? OR r.assigned_ngo_id = ?)
       ORDER BY r.created_at DESC`,
      [status, req.user.organization_id || null],
    );

    res.json({ reports: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch NGO reports' });
  }
});

router.post('/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const db = getDb();
    await db.query(
      `UPDATE reports
       SET status = ?
       WHERE id = ?`,
      [status, id],
    );

    // If resolved, potentially update user stats
    if (status === 'resolved') {
      const reportRes = await db.query('SELECT user_id FROM reports WHERE id = ?', [id]);
      if (reportRes.rows.length) {
        await db.query(
          'UPDATE users SET trust_score = trust_score + 5 WHERE id = ?',
          [reportRes.rows[0].user_id]
        );
      }
    }

    res.json({ message: 'Case status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update case status' });
  }
});

export default router;

