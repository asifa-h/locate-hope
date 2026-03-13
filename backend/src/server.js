import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Allow dev frontend on any localhost port
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded media (secured via routes, not direct listing)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'LocateHope API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/user', userRoutes);

async function start() {
  try {
    await connectDb();
  } catch (err) {
    console.error(
      'Database connection not initialized. Check your DATABASE_URL in .env.',
      err,
    );
  }

  app.listen(PORT, () => {
    console.log(`LocateHope backend listening on port ${PORT}`);
  });

  // Keep the process alive
  setInterval(() => {}, 1000 * 60 * 60);
}

start();

