const express = require('express');
const router  = express.Router();
const CITIES  = require('../data/cities');

/**
 * GET /api/search/cities?q=ch
 *
 * Returns Tamil Nadu cities whose name starts with the query string (case-insensitive).
 * If no query is provided, returns all cities.
 *
 * Response:
 *   { success: true, query: "ch", results: ["Chennai","Chengalpattu", ...] }
 */
router.get('/', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();

  const results = q
    ? CITIES.filter((city) => city.toLowerCase().startsWith(q))
    : CITIES;

  return res.json({
    success: true,
    query:   q,
    count:   results.length,
    results,
  });
});

module.exports = router;
