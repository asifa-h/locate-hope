import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export function connectDb() {
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', '..', 'locatehope.sqlite');

    db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Error connecting to SQLite:', err.message);
        reject(err);
      } else {
        console.log('Connected to SQLite database.');
        
        // Promisify the query method BEFORE initialization
        db.query = (sql, params = []) => {
          return new Promise((resolveQuery, rejectQuery) => {
            if (sql.trim().toLowerCase().startsWith('select')) {
              db.all(sql, params, (errQuery, rows) => {
                if (errQuery) rejectQuery(errQuery);
                else resolveQuery({ rows });
              });
            } else {
              db.run(sql, params, function (errQuery) {
                if (errQuery) rejectQuery(errQuery);
                else resolveQuery({ lastID: this.lastID, changes: this.changes, rows: [] });
              });
            }
          });
        };

        try {
          await initializeTables();
          await seedMockData();
          resolve(db);
        } catch (e) {
          console.error('Error during database initialization:', e);
          reject(e);
        }
      }
    });
  });
}

export function getDb() {
  if (!db) {
    throw new Error('Database has not been initialized. Call connectDb() first.');
  }
  return db;
}

function initializeTables() {
  return new Promise((resolve, reject) => {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        trust_score INTEGER NOT NULL DEFAULT 0,
        total_reports INTEGER NOT NULL DEFAULT 0,
        verified_reports INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        phone TEXT,
        capacity_total INTEGER DEFAULT 0,
        capacity_available INTEGER DEFAULT 0,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        description TEXT NOT NULL,
        urgency TEXT NOT NULL,
        notes TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        media_path TEXT,
        media_type TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        assigned_ngo_id INTEGER REFERENCES organizations(id),
        rejection_reason TEXT,
        is_duplicate_of INTEGER REFERENCES reports(id),
        verified_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        coupon_code TEXT,
        sponsor TEXT,
        expires_at DATETIME,
        total_available INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        reward_id INTEGER NOT NULL REFERENCES rewards(id),
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.exec(schema, (err) => {
      if (err) {
        console.error('Error initializing tables:', err.message);
        reject(err);
      } else {
        console.log('SQLite tables initialized.');
        resolve();
      }
    });
  });
}

async function seedMockData() {
  // const usersCount = await db.query('SELECT COUNT(*) as count FROM users');
  // if (usersCount.rows[0].count > 0) return;

  console.log('Clearing and Seeding comprehensive mock data...');
  
  await db.query('DELETE FROM user_rewards');
  await db.query('DELETE FROM rewards');
  await db.query('DELETE FROM reports');
  await db.query('DELETE FROM organizations');
  await db.query('DELETE FROM users');
  
  // Password is 'password123'
  const passHash = '$2b$10$ROZ5GwPk/tvc6TSTVhBV5uM.v1TMm/MaLVRzFD8et9ZJcSY0md7G.'; 

  // Seed Users
  await db.query(
    'INSERT INTO users (name, email, password_hash, phone, role, trust_score, total_reports, verified_reports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['System Admin', 'admin@locatehope.com', passHash, '0000000000', 'admin', 100, 0, 0]
  );

  await db.query(
    'INSERT INTO users (name, email, password_hash, phone, role, trust_score, total_reports, verified_reports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Hope NGO Staff', 'ngo@locatehope.com', passHash, '1111111111', 'ngo', 50, 0, 0]
  );

  await db.query(
    'INSERT INTO users (name, email, password_hash, phone, role, trust_score, total_reports, verified_reports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['John Citizen', 'user@locatehope.com', passHash, '2222222222', 'user', 85, 12, 10]
  );

  await db.query(
    'INSERT INTO users (name, email, password_hash, phone, role, trust_score, total_reports, verified_reports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Sarah Green', 'sarah@example.com', passHash, '3333333333', 'user', 45, 5, 3]
  );

  // Seed Organizations
  await db.query(
    'INSERT INTO organizations (name, category, phone, capacity_total, capacity_available, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Downtown Shelter', 'Shelter', '555-0101', 100, 15, 40.7128, -74.0060]
  );
  await db.query(
    'INSERT INTO organizations (name, category, phone, capacity_total, capacity_available, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Community Food Bank', 'FoodBank', '555-0102', 0, 0, 40.7306, -73.9352]
  );
  await db.query(
    'INSERT INTO organizations (name, category, phone, capacity_total, capacity_available, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Senior Care Home', 'OldAgeHome', '555-0103', 40, 5, 40.7589, -73.9851]
  );
  await db.query(
    'INSERT INTO organizations (name, category, phone, capacity_total, capacity_available, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['City Rehab Center', 'RehabCenter', '555-0104', 30, 2, 40.7829, -73.9654]
  );

  // Seed Reports (Varied status and urgency for charts)
  // Pending reports
  await db.query(
    'INSERT INTO reports (user_id, description, urgency, notes, latitude, longitude, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now", "-1 hour"))',
    [3, 'Injured person found near Central Park entrance.', 'emergency', 'Needs immediate medical attention.', 40.7829, -73.9654, 'pending']
  );
  await db.query(
    'INSERT INTO reports (user_id, description, urgency, notes, latitude, longitude, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now", "-3 hours"))',
    [4, 'Elderly person looks disoriented near the bus stop.', 'medium', 'Wearing a red coat.', 40.7589, -73.9851, 'pending']
  );

  // Assigned to NGO
  await db.query(
    'INSERT INTO reports (user_id, description, urgency, notes, latitude, longitude, status, assigned_ngo_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now", "-5 hours"))',
    [3, 'Homeless group seeking food and blankets.', 'low', 'Near the subway station.', 40.7306, -73.9352, 'assigned', 1,]
  );

  // In Progress
  await db.query(
    'INSERT INTO reports (user_id, description, urgency, notes, latitude, longitude, status, assigned_ngo_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now", "-1 day"))',
    [3, 'Person sleeping in the cold without a jacket.', 'emergency', 'Urgent help needed.', 40.7128, -74.0060, 'in_progress', 1]
  );

  // Resolved
  await db.query(
    'INSERT INTO reports (user_id, description, urgency, notes, latitude, longitude, status, assigned_ngo_id, created_at, verified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now", "-2 days"), datetime("now", "-1 day"))',
    [4, 'Stray individual needing basic hygiene and food.', 'low', 'Referred to local food bank.', 40.7306, -73.9352, 'resolved', 2]
  );

  // More historical data for Trend Chart
  for (let i = 3; i <= 7; i++) {
    await db.query(
      'INSERT INTO reports (user_id, description, urgency, latitude, longitude, status, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now", ?))',
      [3, `Historical report ${i}`, i % 2 === 0 ? 'medium' : 'low', 40.7, -74.0, 'approved', `-${i} days`]
    );
  }

  // Seed Rewards
  await db.query(
    'INSERT INTO rewards (title, description, coupon_code, sponsor, total_available) VALUES (?, ?, ?, ?, ?)',
    ['Free Warm Meal', 'One free hot meal at any participating City Kitchen.', 'WARMMEAL26', 'City Kitchens', 200]
  );
  await db.query(
    'INSERT INTO rewards (title, description, coupon_code, sponsor, total_available) VALUES (?, ?, ?, ?, ?)',
    ['Supermarket Discount', '15% off on essential groceries.', 'GROCERY15', 'MegaMart', 500]
  );

  // Assign a reward to our main mock user
  await db.query(
    'INSERT INTO user_rewards (user_id, reward_id, note) VALUES (?, ?, ?)',
    [3, 1, 'Great job reporting the Central Park case!']
  );

  console.log('Comprehensive mock data seeded.');
}

