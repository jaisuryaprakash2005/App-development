import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows } from '../theme';
import { useSaved } from '../context/SavedContext';

const BADGE_BG = {
  white: 'rgba(255,255,255,0.9)',
  sage: 'rgba(216,232,199,0.9)',
  gray: 'rgba(229,226,219,0.9)',
};

function Badge({ badge }) {
  return (
    <View style={[styles.badge, { backgroundColor: BADGE_BG[badge.variant] }]}>
      {!!badge.icon && (
        <MaterialCommunityIcons name={badge.icon} size={13} color="#b8860b" />
      )}
      <Text style={[styles.badgeText, { color: badge.textColor }]}>{badge.label}</Text>
    </View>
  );
}

export default function PropertyCard({ property, onPressDetails, onPressSecondary }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(property.id);
  const p = property;

  return (
    <View style={styles.card}>
      {/* Media header */}
      <View style={styles.media}>
        <Image source={{ uri: p.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />

        <View style={styles.badgeRow}>
          {p.badges.map((b) => (
            <Badge key={b.label} badge={b} />
          ))}
        </View>

        <Pressable
          style={styles.saveBtn}
          onPress={() => toggle(p.id)}
          accessibilityRole="button"
          accessibilityLabel={`Save ${p.title}`}
        >
          <MaterialCommunityIcons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? '#c0392b' : colors.primaryDark}
          />
        </Pressable>

        <View style={styles.possession}>
          <Text style={styles.possessionText}>{p.possession}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Text style={styles.price}>{p.price}</Text>
            <Text style={styles.priceNote} numberOfLines={1}>
              {p.priceNote}
            </Text>
          </View>
          <Text style={styles.perSqft}>{p.perSqft}</Text>
        </View>

        <View style={{ gap: 2 }}>
          <Text style={styles.title}>{p.title}</Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={13} color={colors.textSecondary} />
            <Text style={styles.location}>{p.location}</Text>
          </View>
        </View>

        {/* Spec grid */}
        <View style={styles.specs}>
          {p.specs.map((s) => (
            <View key={s.label} style={styles.spec}>
              <Text style={styles.specLabel}>{s.label}</Text>
              <Text style={styles.specValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
            onPress={() => onPressDetails?.(p)}
          >
            <Text style={styles.primaryBtnText}>View Details</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
            onPress={() => onPressSecondary?.(p)}
          >
            <MaterialCommunityIcons
              name={p.secondaryCta.icon}
              size={16}
              color={colors.sageText}
            />
            <Text style={styles.secondaryBtnText}>{p.secondaryCta.label}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  media: { height: 218.75, backgroundColor: colors.surfaceMuted },
  badgeRow: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: radius.pill,
    ...shadows.soft,
  },
  badgeText: { fontFamily: fonts.inter.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.48 },
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    ...shadows.soft,
  },
  possession: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,38,32,0.8)',
  },
  possessionText: { fontFamily: fonts.inter.semibold, fontSize: 11, lineHeight: 14, color: colors.white },

  body: { padding: 16, gap: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 36 },
  priceLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexShrink: 1 },
  price: {
    fontFamily: fonts.manrope.extrabold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.28,
    color: colors.primaryDark,
  },
  priceNote: {
    flexShrink: 1,
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  perSqft: {
    fontFamily: fonts.inter.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 8,
  },
  title: { fontFamily: fonts.manrope.bold, fontSize: 18, lineHeight: 24.75, color: colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontFamily: fonts.manrope.regular, fontSize: 13, lineHeight: 20, color: colors.textSecondary },

  specs: {
    flexDirection: 'row',
    gap: 6,
    padding: 8,
    marginTop: 4,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
  },
  spec: { flex: 1, alignItems: 'center' },
  specLabel: { fontFamily: fonts.inter.medium, fontSize: 11, lineHeight: 14, color: colors.textMuted, textAlign: 'center' },
  specValue: { fontFamily: fonts.inter.semibold, fontSize: 13, lineHeight: 20, color: colors.textPrimary, textAlign: 'center' },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  primaryBtnText: { fontFamily: fonts.inter.semibold, fontSize: 14, lineHeight: 20, color: colors.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.sage,
  },
  secondaryBtnText: { fontFamily: fonts.inter.semibold, fontSize: 14, lineHeight: 20, color: colors.sageText },
});
