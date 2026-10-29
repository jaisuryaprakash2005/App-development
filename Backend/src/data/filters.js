// Property type options
const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'villa', label: 'Villas' },
  { id: 'plot', label: 'Plot' },
  { id: 'independent_house', label: 'Independent House' },
];

// Budget range options
const BUDGET_RANGES = [
  { id: 'b1', label: '1L – 2L', min: 1000000, max: 2000000 },
  { id: 'b2', label: '3L – 4L', min: 3000000, max: 4000000 },
  { id: 'b3', label: '4L – 5L', min: 4000000, max: 5000000 },
  { id: 'b4', label: '10L – 20L', min: 10000000, max: 20000000 },
  { id: 'b5', label: '20L – 30L', min: 20000000, max: 30000000 },
  { id: 'b6', label: '30L – 40L', min: 30000000, max: 40000000 },
  { id: 'b7', label: '50L – 1Cr', min: 5000000, max: 10000000 },
  { id: 'b8', label: '1Cr – 2Cr', min: 10000000, max: 20000000 },
  { id: 'b9', label: '3Cr – 4Cr', min: 30000000, max: 40000000 },
  { id: 'b10', label: '4Cr – 5Cr', min: 40000000, max: 50000000 },
  { id: 'b11', label: '10Cr – 20Cr', min: 100000000, max: 200000000 },
  { id: 'b12', label: '20Cr – 30Cr', min: 200000000, max: 300000000 },
  { id: 'b13', label: '30Cr – 40Cr', min: 300000000, max: 400000000 },
  { id: 'b14', label: '40Cr – 50Cr', min: 400000000, max: 500000000 },
  { id: 'b15', label: 'More than 50Cr', min: 500000000, max: null },
];

module.exports = { PROPERTY_TYPES, BUDGET_RANGES };
