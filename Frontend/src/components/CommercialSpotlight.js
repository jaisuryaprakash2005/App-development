import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows } from '../theme';
import { COMMERCIAL_METRICS } from '../data/mockData';

export default function CommercialSpotlight({ onPressExplore }) {
  return (
    <View style={styles.card}>
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>INSTITUTIONAL ASSETS</Text>
        </View>
        <Text style={styles.tagCaption}>High Cap Rate</Text>
      </View>

      <View>
        <Text style={styles.title}>Commercial Real Estate Spotlight</Text>
        <Text style={styles.body}>
          Pre-leased Grade-A corporate towers, co-working suites & high-street retail spaces with
          guaranteed long leases.
        </Text>
      </View>

      <View style={styles.metrics}>
        {COMMERCIAL_METRICS.map((m) => (
          <View key={m.label} style={styles.metric}>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        onPress={onPressExplore}
        accessibilityRole="button"
      >
        <Text style={styles.ctaText}>Explore Commercial</Text>
        <MaterialCommunityIcons name="arrow-right" size={14} color={colors.white} />
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
    overflow: 'hidden',
    ...shadows.card,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { backgroundColor: colors.amber, paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.pill },
  tagText: { fontFamily: fonts.inter.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.48, color: colors.amberText },
  tagCaption: { fontFamily: fonts.inter.medium, fontSize: 11, lineHeight: 14, color: colors.textMuted },
  title: { fontFamily: fonts.manrope.bold, fontSize: 20, lineHeight: 28, color: colors.primaryDark },
  body: { marginTop: 4, fontFamily: fonts.manrope.regular, fontSize: 13, lineHeight: 20, color: colors.textSecondary },
  metrics: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  metric: {
    flex: 1,
    minHeight: 94,
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
  },
  metricValue: { fontFamily: fonts.manrope.bold, fontSize: 20, lineHeight: 26, color: colors.primaryDark, textAlign: 'center' },
  metricLabel: { marginTop: 6, fontFamily: fonts.inter.medium, fontSize: 11, lineHeight: 14, color: colors.textMuted, textAlign: 'center' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    ...shadows.soft,
  },
  ctaText: { fontFamily: fonts.inter.semibold, fontSize: 14, lineHeight: 20, color: colors.white },
});
