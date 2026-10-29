import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeroSection from '../components/HeroSection';
import BottomTabBar from '../components/BottomTabBar';
import CategoryCarousel from '../components/CategoryCarousel';
import SectionHeader from '../components/SectionHeader';
import PropertyCard from '../components/PropertyCard';
import CityGrid from '../components/CityGrid';
import CommercialSpotlight from '../components/CommercialSpotlight';
import PostPropertyBanner from '../components/PostPropertyBanner';
import Footer from '../components/Footer';
import FilterModal from '../components/FilterModal';
import SearchScreen from '../screen/SearchScreen';
import PostScreen from '../screen/PostScreen';
import SavedScreen from '../screen/SavedScreen';
import AccountScreen from '../screen/AccountScreen';

import { colors, fonts, spacing } from '../theme';
import { CATEGORIES, CITIES, FEATURED_PROPERTIES } from '../data/mockData';
import { fetchFilters } from '../services/api';

// ─── Label helpers ────────────────────────────────────────────────────────────
function labelsFor(options, ids) {
  if (!ids.length) return 'Any';
  return ids.map((id) => options.find((o) => o.id === id)?.label ?? id).join(', ');
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [mode, setMode] = useState('Buy');
  const [activeTab, setActiveTab] = useState('home');

  // Filter options fetched from backend
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);

  // Selected filter ids
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(''); // single value

  // Modal visibility
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  // Fetch filter options once on mount
  useEffect(() => {
    fetchFilters().then(({ propertyTypes, budgetRanges }) => {
      setPropertyTypeOptions(propertyTypes);
      setBudgetOptions(budgetRanges);
    });
  }, []);

  // TODO: replace with real navigation / API
  const todo = useCallback((name) => (arg) => {
    console.log(`[TODO] ${name}`, arg?.id ?? arg ?? '');
    Alert.alert(name, 'Hook this up to navigation or your API.');
  }, []);

  const searchProps = {
    propertyType: labelsFor(propertyTypeOptions, selectedTypes) || 'Select Type',
    budget: labelsFor(budgetOptions, selectedBudget ? [selectedBudget] : []) || 'Select Budget',
    isTypeActive: selectedTypes.length > 0,
    isBudgetActive: !!selectedBudget,
    onPressType: () => setTypeModalVisible(true),
    onPressBudget: () => setBudgetModalVisible(true),
    onClearType: () => setSelectedTypes([]),
    onClearBudget: () => setSelectedBudget(''),
    onPressLocate: todo('Use my location'),
    onSearch: ({ city, locality } = {}) =>
      console.log('[Search]', { mode, city, locality, selectedTypes, selectedBudget }),
  };

  const onPressWishlist = todo('Wishlist');
  const onPressProfile = todo('Profile');

  function renderTab() {
    switch (activeTab) {
      case 'search': return <SearchScreen />;
      case 'post': return <PostScreen />;
      case 'saved': return <SavedScreen />;
      case 'account': return <AccountScreen />;
      default: return null;
    }
  }

  const isHome = activeTab === 'home';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Non-home tabs render their own full screen ── */}
      {!isHome ? (
        renderTab()
      ) : (
        <>
          {/* ── Sticky fixed header ── */}
          <View style={styles.stickyHeader}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="shield-check" size={22} color={colors.primary} />
              <Text style={styles.badgeText}>PROBRIDGE</Text>
            </View>
            <View style={styles.iconGroup}>
              <TouchableOpacity onPress={onPressWishlist} activeOpacity={0.7} hitSlop={8}>
                <MaterialCommunityIcons name="heart-outline" size={26} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressProfile} activeOpacity={0.7} hitSlop={8}>
                <MaterialCommunityIcons name="account-circle-outline" size={26} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <HeroSection mode={mode} onChangeMode={setMode} searchProps={searchProps} />

            <CategoryCarousel data={CATEGORIES} onPressCategory={todo('Category')} />

            {/* Featured properties */}
            <View style={[styles.section, { paddingTop: 24, gap: 8 }]}>
              <SectionHeader
                title="Featured Properties"
                subtitle="Handpicked residences in prime localities"
                actionLabel="See all"
                onActionPress={todo('See all properties')}
              />
              <View style={styles.cards}>
                {FEATURED_PROPERTIES.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onPressDetails={todo('View details')}
                    onPressSecondary={todo(p.secondaryCta.label)}
                  />
                ))}
              </View>
            </View>

            {/* Cities */}
            <View style={[styles.section, { paddingTop: 40, gap: 12 }]}>
              <SectionHeader
                title="Find Properties by City"
                subtitle="Top urban hubs with high rental yields & capital appreciation"
              />
              <CityGrid cities={CITIES} onPressCity={todo('City')} />
            </View>

            {/* Commercial + banner */}
            <View style={[styles.section, { paddingTop: 40 }]}>
              <CommercialSpotlight onPressExplore={todo('Explore commercial')} />
            </View>
            <View style={[styles.section, { paddingTop: 24 }]}>
              <PostPropertyBanner onPressList={todo('List your property')} />
            </View>

            <Footer />
          </ScrollView>
        </>
      )}

      {/* ── Fixed bottom tab bar ── */}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />

      {/* ── Property Type filter modal ── */}
      <FilterModal
        visible={typeModalVisible}
        title="Property Type"
        options={propertyTypeOptions}
        selected={selectedTypes}
        onSelect={setSelectedTypes}
        onClose={() => setTypeModalVisible(false)}
        multiSelect={true}
      />

      {/* ── Budget filter modal (single-select) ── */}
      <FilterModal
        visible={budgetModalVisible}
        title="Budget Range"
        options={budgetOptions}
        selected={selectedBudget ? [selectedBudget] : []}
        onSelect={(ids) => setSelectedBudget(ids[0] ?? '')}
        onClose={() => setBudgetModalVisible(false)}
        multiSelect={false}
      />

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 80 },
  section: { paddingHorizontal: spacing.screen },
  cards: { paddingTop: 4, gap: 16 },
});
