import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows } from '../theme';

export default function PostPropertyBanner({ onPressList }) {
  return (
    <View style={styles.card}>
      {/* Decorative "contour lines": concentric rings, bottom-right */}
      <View pointerEvents="none" style={styles.contours}>
        {[176, 136, 96, 56].map((size) => (
          <View
            key={size}
            style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ))}
      </View>
      <View pointerEvents="none" style={styles.glow} />

      <View style={styles.chip}>
        <MaterialCommunityIcons name="star-four-points" size={12} color={colors.sage} />
        <Text style={styles.chipText}>ZERO LISTING FEE</Text>
      </View>

      <Text style={styles.title}>Have a Property to List?</Text>
      <Text style={styles.body}>
        Connect directly with 10L+ genuine buyers & tenants across India. Verified leads, instant
        inquiries, zero brokerage options.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        onPress={onPressList}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="plus-circle-outline" size={16} color={colors.primary} />
        <Text style={styles.ctaText}>List Your Property Free</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 16,
    overflow: 'hidden',
    ...shadows.raised,
  },
  contours: {
    position: 'absolute',
    right: -24,
    bottom: -32,
    width: 176,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  glow: {
    position: 'absolute',
    top: 8,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,222,167,0.2)',
  },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chipText: { fontFamily: fonts.inter.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: colors.sage },
  title: { marginTop: 8, fontFamily: fonts.manrope.bold, fontSize: 20, lineHeight: 28, letterSpacing: -0.5, color: colors.white },
  body: { marginTop: 4, fontFamily: fonts.manrope.regular, fontSize: 13, lineHeight: 21.13, color: colors.onDarkMuted },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.sage,
    ...shadows.card,
  },
  ctaText: { fontFamily: fonts.inter.bold, fontSize: 14, lineHeight: 20, color: colors.primary },
});
