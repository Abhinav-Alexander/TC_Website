
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'], // Vite default
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'tc_website';
const port = process.env.PORT || 8080;

if (!mongoUri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const client = new MongoClient(mongoUri, {
  // sensible defaults; SRV URI handles pool by default
});

let db;
let bookings;

async function connectMongo() {
  await client.connect();
  db = client.db(dbName);
  bookings = db.collection('bookings');
  // Optional indexes
  await bookings.createIndex({ email: 1 });
  await bookings.createIndex({ createdAt: -1 });
  console.log(`Connected to MongoDB database: ${dbName}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const payload = req.body || {};
    const doc = {
      fullName: payload.fullName?.trim(),
      email: payload.email?.toLowerCase().trim(),
      phone: payload.phone?.trim(),
      service: payload.service?.trim(),
      preferredDate: payload.preferredDate,   // YYYY-MM-DD from your form
      preferredTime: payload.preferredTime,   // HH:mm from your form
      notes: payload.notes?.trim() || '',
      createdAt: new Date()
    };

    if (!doc.fullName || !doc.email || !doc.service) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const result = await bookings.insertOne(doc);
    return res.status(201).json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

// List bookings (for testing/admin; lock down in production)
app.get('/api/bookings', async (req, res) => {
  try {
    const items = await bookings
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return res.json({ ok: true, items });
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

connectMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close().catch(() => {});
  process.exit(0);
});