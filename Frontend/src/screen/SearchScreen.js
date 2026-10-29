import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, fonts, radius, shadows, spacing } from '../theme';
import { CITIES } from '../data/mockData';
import { searchLocalityCities, searchLocalities } from '../services/api';

// ─── Suggestion dropdown (shared by both inputs) ─────────────────────────────
function Dropdown({ items, onSelect, subLabel, icon = 'map-marker-outline' }) {
  if (!items.length) return null;
  return (
    <View style={styles.dropdown}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 228 }}
        nestedScrollEnabled
      >
        {items.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={styles.suggestion}
              activeOpacity={0.7}
              onPress={() => onSelect(item)}
            >
              <View style={styles.suggestionIcon}>
                <MaterialCommunityIcons name={icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestionText}>{item}</Text>
                {subLabel ? (
                  <Text style={styles.suggestionSub}>{subLabel}</Text>
                ) : null}
              </View>
              <MaterialCommunityIcons name="arrow-top-left" size={13} color={colors.textMuted} />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── City photo card (Popular Cities grid) ────────────────────────────────────
function CityCard({ city, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.cityCard, pressed && { opacity: 0.88 }]}
      onPress={() => onPress?.(city)}
      accessibilityRole="button"
      accessibilityLabel={city.name}
    >
      <ImageBackground
        source={{ uri: city.image }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,38,32,0)', 'rgba(0,38,32,0.42)', 'rgba(0,38,32,0.88)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cityText}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.cityCount}>{city.count}</Text>
      </View>
    </Pressable>
  );
}

// ─── SearchScreen ─────────────────────────────────────────────────────────────
export default function SearchScreen() {
  // ── City search state ──
  const [cityQuery, setCityQuery]         = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDrop, setShowCityDrop]   = useState(false);
  const [selectedCity, setSelectedCity]   = useState(''); // locked city name

  // ── Locality search state ──
  const [localityQuery, setLocalityQuery]         = useState('');
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [showLocalityDrop, setShowLocalityDrop]   = useState(false);
  const [selectedLocality, setSelectedLocality]   = useState('');

  const cityDebounce     = useRef(null);
  const localityDebounce = useRef(null);
  const cityInputRef     = useRef(null);
  const localityInputRef = useRef(null);

  // ── Debounced city autocomplete ──
  useEffect(() => {
    clearTimeout(cityDebounce.current);
    if (!cityQuery.trim()) { setCitySuggestions([]); setShowCityDrop(false); return; }
    cityDebounce.current = setTimeout(async () => {
      const results = await searchLocalityCities(cityQuery);
      setCitySuggestions(results);
      setShowCityDrop(results.length > 0);
    }, 280);
    return () => clearTimeout(cityDebounce.current);
  }, [cityQuery]);

  // ── Debounced locality autocomplete (only when a city is selected) ──
  useEffect(() => {
    clearTimeout(localityDebounce.current);
    if (!selectedCity) { setLocalitySuggestions([]); setShowLocalityDrop(false); return; }
    if (!localityQuery.trim()) {
      // Show all localities on empty query when input is focused
      setLocalitySuggestions([]);
      setShowLocalityDrop(false);
      return;
    }
    localityDebounce.current = setTimeout(async () => {
      const results = await searchLocalities(selectedCity, localityQuery);
      setLocalitySuggestions(results);
      setShowLocalityDrop(results.length > 0);
    }, 280);
    return () => clearTimeout(localityDebounce.current);
  }, [localityQuery, selectedCity]);

  // ── Load top localities when locality input is focused (empty query) ──
  async function handleLocalityFocus() {
    if (!selectedCity) return;
    const results = await searchLocalities(selectedCity, '');
    setLocalitySuggestions(results.slice(0, 8));
    setShowLocalityDrop(results.length > 0);
  }

  // ── Select city → lock it, clear locality ──
  function handleSelectCity(city) {
    setSelectedCity(city);
    setCityQuery('');
    setCitySuggestions([]);
    setShowCityDrop(false);
    setSelectedLocality('');
    setLocalityQuery('');
    cityInputRef.current?.blur();
    // auto-focus locality after short delay
    setTimeout(() => localityInputRef.current?.focus(), 120);
  }

  function handleClearCity() {
    setSelectedCity('');
    setCityQuery('');
    setCitySuggestions([]);
    setShowCityDrop(false);
    setSelectedLocality('');
    setLocalityQuery('');
    setLocalitySuggestions([]);
    setShowLocalityDrop(false);
    cityInputRef.current?.focus();
  }

  // ── Select locality ──
  function handleSelectLocality(locality) {
    setSelectedLocality(locality);
    setLocalityQuery(locality);
    setLocalitySuggestions([]);
    setShowLocalityDrop(false);
    localityInputRef.current?.blur();
    console.log('[Search] Selected:', selectedCity, '→', locality);
  }

  function handleClearLocality() {
    setSelectedLocality('');
    setLocalityQuery('');
    setLocalitySuggestions([]);
    setShowLocalityDrop(false);
    localityInputRef.current?.focus();
  }

  const handleCityCardPress = useCallback((city) => {
    // Pre-fill city search with the tapped city name and auto-select it
    handleSelectCity(city.name);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.heading}>Search</Text>
        <Text style={styles.subheading}>Find properties across India</Text>
      </View>

      {/* ── Search a City section ── */}
      <View style={styles.searchSection}>

        <Text style={styles.stepLabel}>
          <MaterialCommunityIcons name="numeric-1-circle" size={14} color={colors.primary} />
          {'  '}Search a City
        </Text>

        {/* City input or selected chip */}
        <View style={styles.inputCard}>
          {selectedCity ? (
            /* Locked city chip */
            <View style={styles.chipRow}>
              <MaterialCommunityIcons name="city-variant" size={18} color={colors.primary} />
              <View style={styles.chip}>
                <Text style={styles.chipText}>{selectedCity}</Text>
              </View>
              <TouchableOpacity onPress={handleClearCity} hitSlop={8} style={styles.chipClear}>
                <MaterialCommunityIcons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            /* City search input */
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="city-variant-outline" size={19} color={colors.textMuted} />
              <TextInput
                ref={cityInputRef}
                id="city-search-input"
                style={styles.input}
                value={cityQuery}
                onChangeText={setCityQuery}
                placeholder="Type a city name…"
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="words"
                onFocus={() => cityQuery.trim() && setShowCityDrop(citySuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowCityDrop(false), 150)}
              />
              {cityQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setCityQuery(''); setCitySuggestions([]); setShowCityDrop(false); }} hitSlop={8}>
                  <MaterialCommunityIcons name="close-circle" size={17} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* City dropdown */}
          {showCityDrop && (
            <Dropdown
              items={citySuggestions}
              onSelect={handleSelectCity}
              subLabel="India"
              icon="city-variant-outline"
            />
          )}
        </View>

        {/* ── Step 2: Locality search (visible only after city is selected) ── */}
        {!!selectedCity && (
          <>
            <Text style={[styles.stepLabel, { marginTop: 14 }]}>
              <MaterialCommunityIcons name="numeric-2-circle" size={14} color={colors.primary} />
              {'  '}Search a Locality in {selectedCity}
            </Text>

            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name={selectedLocality ? 'map-marker' : 'map-marker-outline'}
                  size={19}
                  color={selectedLocality ? colors.primary : colors.textMuted}
                />
                <TextInput
                  ref={localityInputRef}
                  id="locality-search-input"
                  style={styles.input}
                  value={localityQuery}
                  onChangeText={(t) => {
                    setLocalityQuery(t);
                    if (selectedLocality) setSelectedLocality('');
                  }}
                  placeholder={`Locality in ${selectedCity}…`}
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="words"
                  onFocus={handleLocalityFocus}
                  onBlur={() => setTimeout(() => setShowLocalityDrop(false), 150)}
                />
                {localityQuery.length > 0 && (
                  <TouchableOpacity onPress={handleClearLocality} hitSlop={8}>
                    <MaterialCommunityIcons name="close-circle" size={17} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Locality dropdown */}
              {showLocalityDrop && (
                <Dropdown
                  items={localitySuggestions}
                  onSelect={handleSelectLocality}
                  subLabel={selectedCity}
                  icon="map-marker-outline"
                />
              )}
            </View>

            {/* Selected result pill */}
            {!!selectedLocality && (
              <View style={styles.resultPill}>
                <MaterialCommunityIcons name="check-circle" size={16} color={colors.primary} />
                <Text style={styles.resultText}>
                  {selectedLocality}, {selectedCity}
                </Text>
                <TouchableOpacity
                  id="search-go-btn"
                  style={styles.goBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    console.log('[Search] Go →', selectedCity, selectedLocality)
                  }
                >
                  <Text style={styles.goBtnText}>Search</Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* ── Popular Cities grid ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Cities</Text>
          <Text style={styles.sectionSub}>Tap a city to start searching</Text>
        </View>

        <View style={styles.cityGrid}>
          {CITIES.map((city) => (
            <CityCard key={city.id} city={city} onPress={handleCityCardPress} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  /* Header */
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 4,
  },
  heading: {
    fontFamily: fonts.manrope.bold,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subheading: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* Search section */
  searchSection: {
    paddingHorizontal: spacing.screen,
    paddingTop: 16,
    paddingBottom: 8,
    zIndex: 20,
  },
  stepLabel: {
    fontFamily: fonts.inter.semibold,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  /* Input card wraps input + dropdown */
  inputCard: {
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    ...shadows.card,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.manrope.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },

  /* Locked city chip */
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.card,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 14,
    color: colors.primary,
  },
  chipClear: {
    padding: 2,
  },

  /* Dropdown */
  dropdown: {
    marginTop: 5,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    ...shadows.raised,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  suggestionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  suggestionSub: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 56,
  },

  /* Result pill + go button */
  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    ...shadows.soft,
  },
  resultText: {
    flex: 1,
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  goBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  goBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: '#fff',
  },

  /* Scroll / Popular Cities */
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 96,
  },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 18,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* City grid */
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cityCard: {
    width: '48.3%',
    height: 130,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: colors.primaryDark,
    ...shadows.soft,
  },
  cityText: {},
  cityName: {
    fontFamily: fonts.inter.bold,
    fontSize: 15,
    lineHeight: 19,
    color: '#fff',
  },
  cityCount: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.sage ?? '#a8c4b8',
    marginTop: 2,
  },
});
