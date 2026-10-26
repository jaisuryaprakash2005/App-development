import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows } from '../theme';

function FilterButton({ label, value, onPress }) {
  return (
    <Pressable style={styles.filter} onPress={onPress} accessibilityRole="button">
      <View style={{ flex: 1 }}>
        <Text style={styles.filterLabel}>{label}</Text>
        <Text style={styles.filterValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function SearchCard({
  query,
  onChangeQuery,
  propertyType,
  budget,
  onPressType,
  onPressBudget,
  onPressLocate,
  onSearch,
}) {
  return (
    <View style={styles.card}>
      {/* Search input */}
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search city, locality, or project"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <Pressable onPress={onPressLocate} hitSlop={8} accessibilityLabel="Use my location">
          <MaterialCommunityIcons name="crosshairs-gps" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Type + Budget */}
      <View style={styles.filterRow}>
        <FilterButton label="Type" value={propertyType} onPress={onPressType} />
        <FilterButton label="Budget" value={budget} onPress={onPressBudget} />
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        onPress={onSearch}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="magnify" size={17} color={colors.white} />
        <Text style={styles.ctaText}>Search Properties</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
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
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterRow: { flexDirection: 'row', gap: 4 },
  filter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterLabel: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textMuted,
  },
  filterValue: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textPrimary,
  },
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
