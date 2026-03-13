import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../utils/db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '7d';

router.post('/register', async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDb();

    const normalizedRole =
      role && ['user', 'admin', 'ngo'].includes(role) ? role : 'user';
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await db.query(
      `INSERT INTO users (name, email, password_hash, phone, role, trust_score)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [name, email, passwordHash, phone, normalizedRole],
    );

    const userResult = await db.query(
      'SELECT id, name, email, phone, role, trust_score FROM users WHERE id = ?',
      [insertResult.lastID],
    );

    const user = userResult.rows[0];

    // Check if user is NGO to add organization_id to token
    let organizationId = null;
    if (user.role === 'ngo') {
      const orgResult = await db.query(
        'SELECT id FROM organizations LIMIT 1'
      );
      if (orgResult.rows.length) {
        organizationId = orgResult.rows[0].id;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, organization_id: organizationId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = getDb();
    const result = await db.query(
      'SELECT id, name, email, phone, password_hash, role, trust_score FROM users WHERE email = ?',
      [email],
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    delete user.password_hash;

    // Check if user is NGO to add organization_id to token
    let organizationId = null;
    if (user.role === 'ngo') {
      const orgResult = await db.query(
        'SELECT id FROM organizations LIMIT 1'
      );
      if (orgResult.rows.length) {
        organizationId = orgResult.rows[0].id;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, organization_id: organizationId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to login' });
  }
});

export default router;

