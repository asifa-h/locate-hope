## LocateHope – Community Rescue & Humanitarian Reporting Platform

LocateHope is a full‑stack web platform that allows citizens to report vulnerable individuals (homeless, elderly in distress, injured people, etc.) and connect them with nearby NGOs, shelters, old age homes, and rehabilitation centers.

This repository contains:

- **backend**: Node.js + Express API with PostgreSQL
- **frontend**: React + Vite + Tailwind CSS web client

### Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Leaflet (OpenStreetMap) for maps
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JWT

### Getting started

1. **Backend**

   - Create a PostgreSQL database, e.g. `locatehope`.
   - Enable Postgres extensions (for distance queries):

     ```sql
     CREATE EXTENSION IF NOT EXISTS cube;
     CREATE EXTENSION IF NOT EXISTS earthdistance;
     ```

   - From the `backend` folder:

     ```bash
     cp .env.example .env   # Set DATABASE_URL, JWT_SECRET, FRONTEND_URL, PORT
     psql "$DATABASE_URL" -f db-schema.sql
     npm install
     npm run dev
     ```

2. **Frontend**

   From the `frontend` folder:

   ```bash
   npm install
   npm run dev
   ```

The app will be available at `http://localhost:5173` and talks to the API at `http://localhost:5000` by default.

