import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows } from '../theme';
import { searchLocalityCities, searchLocalities } from '../services/api';

// ─── Filter pill button ───────────────────────────────────────────────────────
function FilterButton({ label, value, isActive, onPress, onClear }) {
  return (
    <Pressable
      style={[styles.filter, isActive && styles.filterActive]}
      onPress={onPress}
      accessibilityRole="button"
    >
      {isActive && <View style={styles.activeDot} />}
      <View style={{ flex: 1 }}>
        <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>{label}</Text>
        <Text style={[styles.filterValue, isActive && styles.filterValueActive]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {isActive ? (
        <TouchableOpacity hitSlop={8} onPress={(e) => { e.stopPropagation?.(); onClear?.(); }}>
          <MaterialCommunityIcons name="close-circle" size={16} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

// ─── Autocomplete dropdown list ───────────────────────────────────────────────
function Dropdown({ items, onSelect, icon = 'map-marker-outline', subLabel }) {
  if (!items.length) return null;
  return (
    <View style={styles.dropdown}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 200 }}
        nestedScrollEnabled
      >
        {items.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && <View style={styles.separator} />}
            <TouchableOpacity
              style={styles.suggestion}
              activeOpacity={0.7}
              onPress={() => onSelect(item)}
            >
              <MaterialCommunityIcons name={icon} size={15} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestionText}>{item}</Text>
                {subLabel ? <Text style={styles.suggestionSub}>{subLabel}</Text> : null}
              </View>
              <MaterialCommunityIcons name="arrow-top-left" size={12} color={colors.textMuted} />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main SearchCard ──────────────────────────────────────────────────────────
export default function SearchCard({
  propertyType,
  budget,
  isTypeActive,
  isBudgetActive,
  onPressType,
  onPressBudget,
  onClearType,
  onClearBudget,
  onPressLocate,
  onSearch,
}) {
  // ── City state ──
  const [cityQuery, setCityQuery]             = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDrop, setShowCityDrop]       = useState(false);
  const [selectedCity, setSelectedCity]       = useState('');

  // ── Locality state ──
  const [localityQuery, setLocalityQuery]             = useState('');
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [showLocalityDrop, setShowLocalityDrop]       = useState(false);
  const [selectedLocality, setSelectedLocality]       = useState('');

  const cityDebounce     = useRef(null);
  const localityDebounce = useRef(null);
  const cityInputRef     = useRef(null);
  const localityInputRef = useRef(null);

  // ── City autocomplete ──
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

  // ── Locality autocomplete ──
  useEffect(() => {
    clearTimeout(localityDebounce.current);
    if (!selectedCity || !localityQuery.trim()) {
      setLocalitySuggestions([]); setShowLocalityDrop(false); return;
    }
    localityDebounce.current = setTimeout(async () => {
      const results = await searchLocalities(selectedCity, localityQuery);
      setLocalitySuggestions(results);
      setShowLocalityDrop(results.length > 0);
    }, 280);
    return () => clearTimeout(localityDebounce.current);
  }, [localityQuery, selectedCity]);

  // Show top localities on focus (empty query)
  async function handleLocalityFocus() {
    if (!selectedCity) return;
    const results = await searchLocalities(selectedCity, '');
    setLocalitySuggestions(results.slice(0, 6));
    setShowLocalityDrop(results.length > 0);
  }

  function handleSelectCity(city) {
    setSelectedCity(city);
    setCityQuery('');
    setCitySuggestions([]);
    setShowCityDrop(false);
    setSelectedLocality('');
    setLocalityQuery('');
    cityInputRef.current?.blur();
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

  function handleSelectLocality(locality) {
    setSelectedLocality(locality);
    setLocalityQuery(locality);
    setLocalitySuggestions([]);
    setShowLocalityDrop(false);
    localityInputRef.current?.blur();
  }

  function handleSearch() {
    setShowCityDrop(false);
    setShowLocalityDrop(false);
    onSearch?.({ city: selectedCity, locality: selectedLocality });
    console.log('[SearchCard] Search →', selectedCity, selectedLocality);
  }

  return (
    <View style={styles.card}>

      {/* ── Row 1: City input ── */}
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons
          name={selectedCity ? 'city-variant' : 'city-variant-outline'}
          size={17}
          color={selectedCity ? colors.primary : colors.textMuted}
        />

        {selectedCity ? (
          /* Locked city chip */
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1}>{selectedCity}</Text>
            </View>
            <TouchableOpacity onPress={handleClearCity} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={15} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          /* City search input */
          <TextInput
            ref={cityInputRef}
            id="home-city-input"
            style={styles.input}
            value={cityQuery}
            onChangeText={setCityQuery}
            placeholder="Search city…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
            onFocus={() => cityQuery.trim() && setShowCityDrop(citySuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowCityDrop(false), 150)}
          />
        )}

        {!selectedCity && cityQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => { setCityQuery(''); setCitySuggestions([]); setShowCityDrop(false); }}
            hitSlop={8}
          >
            <MaterialCommunityIcons name="close-circle" size={15} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <Pressable onPress={onPressLocate} hitSlop={8} accessibilityLabel="Use my location">
          <MaterialCommunityIcons name="crosshairs-gps" size={17} color={colors.primary} />
        </Pressable>
      </View>

      {/* City dropdown */}
      {showCityDrop && (
        <Dropdown items={citySuggestions} onSelect={handleSelectCity} icon="city-variant-outline" />
      )}

      {/* ── Row 2: Locality input (shown after city selected) ── */}
      {!!selectedCity && (
        <>
          <View style={[styles.inputWrap, styles.localityWrap]}>
            <MaterialCommunityIcons
              name={selectedLocality ? 'map-marker' : 'map-marker-outline'}
              size={17}
              color={selectedLocality ? colors.primary : colors.textMuted}
            />
            <TextInput
              ref={localityInputRef}
              id="home-locality-input"
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
              <TouchableOpacity
                onPress={() => { setLocalityQuery(''); setSelectedLocality(''); setLocalitySuggestions([]); setShowLocalityDrop(false); }}
                hitSlop={8}
              >
                <MaterialCommunityIcons name="close-circle" size={15} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Locality dropdown */}
          {showLocalityDrop && (
            <Dropdown
              items={localitySuggestions}
              onSelect={handleSelectLocality}
              icon="map-marker-outline"
              subLabel={selectedCity}
            />
          )}
        </>
      )}

      {/* ── Type + Budget filters ── */}
      <View style={styles.filterRow}>
        <FilterButton
          label="Type"
          value={propertyType}
          isActive={isTypeActive}
          onPress={onPressType}
          onClear={onClearType}
        />
        <FilterButton
          label="Budget"
          value={budget}
          isActive={isBudgetActive}
          onPress={onPressBudget}
          onClear={onClearBudget}
        />
      </View>

      {/* ── Search CTA ── */}
      <Pressable
        id="home-search-btn"
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        onPress={handleSearch}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="magnify" size={17} color={colors.white} />
        <Text style={styles.ctaText}>Search Properties</Text>
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    gap: 8,
    ...shadows.card,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  localityWrap: {
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    color: colors.textPrimary,
  },

  /* Locked city chip inside the input row */
  chipRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flex: 1,
    backgroundColor: `${colors.primary}18`,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    color: colors.primary,
  },

  /* Autocomplete dropdown */
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    ...shadows.raised,
    marginTop: -4,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 36,
  },

  /* Filter row */
  filterRow: { flexDirection: 'row', gap: 4 },
  filter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterActive: {
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}35`,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  filterLabel: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textMuted,
  },
  filterLabelActive: { color: colors.primary },
  filterValue: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  filterValueActive: { color: colors.primary },

  /* CTA button */
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...shadows.card,
  },
  ctaText: {
    fontFamily: fonts.manrope.semibold,
    fontSize: 15,
    lineHeight: 24,
    color: colors.white,
  },
});
