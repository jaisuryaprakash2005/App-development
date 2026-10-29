const express  = require('express');
const router   = express.Router();
const { PROPERTY_TYPES, BUDGET_RANGES } = require('../data/filters');

/**
 * GET /api/filters
 *
 * Returns all available filter options (property types + budget ranges).
 *
 * Response:
 *   {
 *     success: true,
 *     filters: {
 *       propertyTypes: [...],
 *       budgetRanges:  [...]
 *     }
 *   }
 */
router.get('/', (req, res) => {
  return res.json({
    success: true,
    filters: {
      propertyTypes: PROPERTY_TYPES,
      budgetRanges:  BUDGET_RANGES,
    },
  });
});

/**
 * GET /api/filters/types
 * Returns only property type options.
 */
router.get('/types', (req, res) => {
  return res.json({
    success: true,
    propertyTypes: PROPERTY_TYPES,
  });
});

/**
 * GET /api/filters/budgets
 * Returns only budget range options.
 */
router.get('/budgets', (req, res) => {
  return res.json({
    success: true,
    budgetRanges: BUDGET_RANGES,
  });
});

module.exports = router;
