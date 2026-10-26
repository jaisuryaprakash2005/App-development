import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';

const LINKS = [
  { label: 'Buy', href: '#' },
  { label: 'Rent', href: '#' },
  { label: 'Commercial', href: '#' },
  { label: 'New Projects', href: '#' },
  { label: 'Post Property', href: '#' },
  { label: 'Home Loans', href: '#' },
];

const SOCIAL = [
  { name: 'facebook', icon: 'facebook' },
  { name: 'instagram', icon: 'instagram' },
  { name: 'twitter', icon: 'twitter' },
  { name: 'youtube', icon: 'youtube' },
];

export default function Footer() {
  return (
    <View style={styles.wrap}>
      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="home-city" size={22} color={colors.primary} />
          <Text style={styles.logoText}>PropConnect</Text>
        </View>
        <Text style={styles.tagline}>
          India's most trusted real-estate network — connecting buyers, sellers &amp; renters
          across 50+ cities.
        </Text>
      </View>

      {/* Quick links */}
      <View style={styles.linksGrid}>
        {LINKS.map((l) => (
          <Pressable
            key={l.label}
            style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
            onPress={() => Linking.openURL(l.href).catch(() => null)}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>{l.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Social + copyright */}
      <View style={styles.bottom}>
        <Text style={styles.copy}>© {new Date().getFullYear()} PropConnect Pvt. Ltd.</Text>
        <View style={styles.social}>
          {SOCIAL.map((s) => (
            <Pressable
              key={s.name}
              style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.7 }]}
              accessibilityLabel={s.name}
            >
              <MaterialCommunityIcons name={s.icon} size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 40,
    paddingHorizontal: spacing.screen,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: colors.surfaceMuted,
    gap: 16,
  },
  brand: { gap: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: {
    fontFamily: fonts.manrope.extrabold,
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  linksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  linkText: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: { height: 1, backgroundColor: colors.sage, opacity: 0.6 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  copy: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  social: { flexDirection: 'row', gap: 4 },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
