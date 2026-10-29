const express = require('express');
const cors = require('cors');

const searchRouter     = require('./routes/search');
const filtersRouter    = require('./routes/filters');
const localitiesRouter = require('./routes/localities');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());           // Allow React Native / Expo dev client to call this API
app.use(express.json());   // Parse JSON request bodies

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'ProBridge API is running 🚀' });
});

// City search autocomplete  →  GET /api/search/cities?q=ch
app.use('/api/search/cities', searchRouter);

// Filter options            →  GET /api/filters
//                           →  GET /api/filters/types
//                           →  GET /api/filters/budgets
app.use('/api/filters', filtersRouter);

// City names search         →  GET /api/localities/cities?q=ban
// Locality search in city   →  GET /api/localities?city=Bangalore&q=white
app.use('/api/localities', localitiesRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅  ProBridge API running on http://0.0.0.0:${PORT}`);
  console.log(`   Android device URL → http://192.168.68.105:${PORT}`);
  console.log(`   City search (TN)  →  GET /api/search/cities?q=ch`);
  console.log(`   All filters       →  GET /api/filters`);
  console.log(`   City names        →  GET /api/localities/cities?q=ban`);
  console.log(`   Localities        →  GET /api/localities?city=Bangalore&q=white\n`);
});

module.exports = app;
