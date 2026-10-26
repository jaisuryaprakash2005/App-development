import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeroSection from '../components/HeroSection';
import CategoryCarousel from '../components/CategoryCarousel';
import SectionHeader from '../components/SectionHeader';
import PropertyCard from '../components/PropertyCard';
import CityGrid from '../components/CityGrid';
import CommercialSpotlight from '../components/CommercialSpotlight';
import PostPropertyBanner from '../components/PostPropertyBanner';
import Footer from '../components/Footer';

import { colors, spacing } from '../theme';
import { CATEGORIES, CITIES, FEATURED_PROPERTIES } from '../data/mockData';

export default function HomeScreen() {
  const [mode, setMode] = useState('Buy');
  const [query, setQuery] = useState('');
  const [propertyType] = useState('Apartments, Villas');
  const [budget] = useState('₹50L - ₹1.5 Cr');

  // TODO: replace these with react-navigation / API calls.
  const todo = useCallback((name) => (arg) => {
    console.log(`[TODO] ${name}`, arg?.id ?? arg ?? '');
    Alert.alert(name, 'Hook this up to navigation or your API.');
  }, []);

  const searchProps = {
    query,
    onChangeQuery: setQuery,
    propertyType,
    budget,
    onPressType: todo('Choose property type'),
    onPressBudget: todo('Choose budget'),
    onPressLocate: todo('Use my location'),
    onSearch: () => todo('Search')({ id: `${mode}:${query}` }),
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
            actionLabel="See all (240+)"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 96 }, // matches the 96px bottom padding in the design
  section: { paddingHorizontal: spacing.screen },
  cards: { paddingTop: 4, gap: 16 },
});
