import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../utils/db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post(
  '/',
  authenticate,
  upload.single('media'),
  async (req, res) => {
    const {
      description,
      urgency,
      notes,
      latitude,
      longitude,
    } = req.body;

    if (!description || !urgency || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;
    const mediaType = req.file ? req.file.mimetype : null;

    try {
      const db = getDb();

      // Basic duplicate detection: same user, within ~0.001 degrees (~111m) and 15 minutes
      const duplicateCheck = await db.query(
        `SELECT id FROM reports
         WHERE user_id = ?
           AND created_at > datetime('now', '-15 minutes')
           AND ABS(latitude - ?) < 0.001
           AND ABS(longitude - ?) < 0.001`,
        [req.user.id, latitude, longitude],
      );

      const isDuplicate = duplicateCheck.rows.length > 0;
      const baseStatus = 'pending';

      const insertResult = await db.query(
        `INSERT INTO reports
         (user_id, description, urgency, notes, latitude, longitude, media_path, media_type, status, is_duplicate_of)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          description,
          urgency,
          notes || null,
          latitude,
          longitude,
          mediaPath,
          mediaType,
          baseStatus,
          isDuplicate ? duplicateCheck.rows[0].id : null,
        ],
      );

      const result = await db.query(
        'SELECT * FROM reports WHERE id = ?',
        [insertResult.lastID],
      );

      await db.query(
        `UPDATE users
         SET total_reports = total_reports + 1
         WHERE id = ?`,
        [req.user.id],
      );

      res.status(201).json({ report: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to submit report' });
    }
  },
);

router.get('/', authenticate, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT r.*, o.name as assigned_ngo_name
       FROM reports r
       LEFT JOIN organizations o ON r.assigned_ngo_id = o.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id],
    );
    res.json({ reports: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
});

export default router;

