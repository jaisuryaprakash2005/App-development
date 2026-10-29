import { CITY_NAMES, getLocalitiesByCity } from '../data/localities';

// ⚠️  Android devices cannot use "localhost" — use your PC's local IP.
// Your PC IP detected from Expo bundle URL: 192.168.68.105
const BASE_URL = 'http://192.168.68.105:5000';

const FALLBACK_FILTERS = {
  propertyTypes: [
    { id: 'apartment', label: 'Apartment' },
    { id: 'villa', label: 'Villas' },
    { id: 'plot', label: 'Plot' },
    { id: 'independent_house', label: 'Independent House' },
  ],
  budgetRanges: [
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
  ],
};

async function fetchWithTimeout(url, timeoutMs = 2000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Fetch Tamil Nadu city suggestions by prefix.
 * @param {string} q - search query (e.g. "ch")
 * @returns {Promise<string[]>}
 */
export async function searchCities(q = '') {
  const query = (q || '').trim().toLowerCase();
  const fallback = query
    ? CITY_NAMES.filter((c) => c.toLowerCase().includes(query))
    : CITY_NAMES;

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/search/cities?q=${encodeURIComponent(query)}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data.success && Array.isArray(data.results) ? data.results : fallback;
  } catch (err) {
    console.warn('[API] searchCities offline fallback:', err.message);
    return fallback;
  }
}

/**
 * Fetch all filter options (property types + budget ranges).
 * @returns {Promise<{ propertyTypes: [], budgetRanges: [] }>}
 */
export async function fetchFilters() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/filters`);
    if (!res.ok) return FALLBACK_FILTERS;
    const data = await res.json();
    return data.success && data.filters ? data.filters : FALLBACK_FILTERS;
  } catch (err) {
    console.warn('[API] fetchFilters offline fallback:', err.message);
    return FALLBACK_FILTERS;
  }
}

/**
 * Search major Indian city names by a query string.
 * @param {string} q - search query (e.g. "ban")
 * @returns {Promise<string[]>}
 */
export async function searchLocalityCities(q = '') {
  const query = (q || '').trim().toLowerCase();
  const fallback = query
    ? CITY_NAMES.filter((c) => c.toLowerCase().includes(query)).slice(0, 10)
    : CITY_NAMES;

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/localities/cities?q=${encodeURIComponent(query)}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data.success && Array.isArray(data.results) ? data.results : fallback;
  } catch (err) {
    console.warn('[API] searchLocalityCities offline fallback:', err.message);
    return fallback;
  }
}

/**
 * Search localities within a specific city.
 * @param {string} city - exact city name (e.g. "Bangalore")
 * @param {string} q    - locality prefix (e.g. "white")
 * @returns {Promise<string[]>}
 */
export async function searchLocalities(city = '', q = '') {
  const query = (q || '').trim().toLowerCase();
  const localList = getLocalitiesByCity(city);
  const fallback = query
    ? localList.filter((l) => l.toLowerCase().startsWith(query) || l.toLowerCase().includes(query))
    : localList;

  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/api/localities?city=${encodeURIComponent(city)}&q=${encodeURIComponent(query)}`
    );
    if (!res.ok) return fallback;
    const data = await res.json();
    return data.success && Array.isArray(data.results) ? data.results : fallback;
  } catch (err) {
    console.warn('[API] searchLocalities offline fallback:', err.message);
    return fallback;
  }
}
