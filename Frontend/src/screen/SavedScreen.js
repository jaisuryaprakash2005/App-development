import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PropertyCard from '../components/PropertyCard';
import { useSaved } from '../context/SavedContext';
import { FEATURED_PROPERTIES } from '../data/mockData';
import { colors, fonts, spacing } from '../theme';

export default function SavedScreen() {
  const { savedIds } = useSaved();

  // Filter only saved properties from all known properties
  const savedProperties = FEATURED_PROPERTIES.filter((p) => savedIds.has(p.id));
  const hasSaved = savedProperties.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Saved</Text>
        <Text style={styles.subheading}>Your shortlisted properties</Text>
      </View>

      {hasSaved ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Count badge */}
          <View style={styles.countRow}>
            <View style={styles.countBadge}>
              <MaterialCommunityIcons name="heart" size={13} color={colors.primary} />
              <Text style={styles.countText}>
                {savedProperties.length} {savedProperties.length === 1 ? 'Property' : 'Properties'} Saved
              </Text>
            </View>
          </View>

          {/* Real PropertyCards — same format as Home screen */}
          {savedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPressDetails={() => console.log('[Saved] View details:', property.id)}
              onPressSecondary={() => console.log('[Saved] Secondary CTA:', property.id)}
            />
          ))}
        </ScrollView>
      ) : (
        /* Empty state */
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="heart-outline" size={52} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No saved properties yet</Text>
          <Text style={styles.emptySub}>
            Tap the{' '}
            <MaterialCommunityIcons name="heart-outline" size={14} color={colors.textSecondary} />
            {' '}on any property card to save it here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.07)',
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

  scroll: {
    paddingHorizontal: spacing.screen,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 16,
  },

  /* Count badge */
  countRow: { marginBottom: 2 },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  countText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 12,
    color: colors.primary,
  },

  /* Empty state */
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
    paddingBottom: 80,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
