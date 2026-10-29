const express = require('express');
const router  = express.Router();
const { LOCALITIES, CITY_NAMES } = require('../data/localities');

/**
 * GET /api/localities/cities?q=ban
 *
 * Search city names that contain the query string (case-insensitive).
 * Returns up to 10 results. If no query, returns all city names.
 *
 * Response: { success: true, results: ["Bangalore", "Bhopal", ...] }
 */
router.get('/cities', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const results = q
    ? CITY_NAMES.filter((c) => c.toLowerCase().includes(q)).slice(0, 10)
    : CITY_NAMES;

  return res.json({ success: true, count: results.length, results });
});

/**
 * GET /api/localities?city=Bangalore&q=white
 *
 * Returns localities within the specified city that start with the query.
 * City match is case-insensitive. Query is optional; if empty, returns all.
 *
 * Response: { success: true, city: "Bangalore", results: ["Whitefield"] }
 */
router.get('/', (req, res) => {
  const city = (req.query.city || '').trim();
  const q    = (req.query.q    || '').trim().toLowerCase();

  if (!city) {
    return res.status(400).json({ success: false, message: 'city query param is required' });
  }

  // Case-insensitive city lookup
  const key = Object.keys(LOCALITIES).find(
    (k) => k.toLowerCase() === city.toLowerCase()
  );

  if (!key) {
    return res.json({ success: true, city, results: [] });
  }

  const localities = LOCALITIES[key];
  const results = q
    ? localities.filter((l) => l.toLowerCase().startsWith(q))
    : localities;

  return res.json({ success: true, city: key, count: results.length, results });
});

module.exports = router;
