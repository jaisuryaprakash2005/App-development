import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import ListingFormScreen from './ListingFormScreen';

const STEPS = [
  { icon: 'home-outline', title: 'Basic Details', desc: 'Property type, BHK, area' },
  { icon: 'map-marker-outline', title: 'Location', desc: 'City, locality, landmark' },
  { icon: 'currency-inr', title: 'Price & Details', desc: 'Price, possession, amenities' },
  { icon: 'camera-outline', title: 'Photos & Videos', desc: 'Upload property media' },
  { icon: 'account-outline', title: 'Contact Info', desc: 'Name, phone, availability' },
];

export default function PostScreen() {
  const [showForm, setShowForm] = useState(false);

  // Show multi-step form when "Start Listing" is tapped
  if (showForm) {
    return <ListingFormScreen onBack={() => setShowForm(false)} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Post Property</Text>
          <Text style={styles.subheading}>List your property for free — reach lakhs of buyers</Text>
        </View>

        {/* Hero banner */}
        <View style={styles.banner}>
          <MaterialCommunityIcons name="home-city-outline" size={48} color={colors.primary} />
          <Text style={styles.bannerTitle}>Sell or Rent Faster</Text>
          <Text style={styles.bannerSub}>
            Join 2 lakh+ property owners who trust ProBridge
          </Text>
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.85}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.startBtnText}>Start Listing</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Steps */}
        <Text style={styles.stepsTitle}>How it works</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <MaterialCommunityIcons name={step.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
          </View>
        ))}

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => setShowForm(true)}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
          <Text style={styles.ctaText}>Post Your Property — Free</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.screen, paddingBottom: 100 },

  header: { paddingTop: 8, paddingBottom: 20 },
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
    marginTop: 4,
  },

  banner: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
    ...shadows.card,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  bannerTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 8,
  },
  bannerSub: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startBtnText: {
    fontFamily: fonts.manrope.bold,
    fontSize: 15,
    color: '#fff',
  },

  stepsTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    padding: 14,
    ...shadows.soft,
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { flex: 1 },
  stepTitle: {
    fontFamily: fonts.inter.semibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  stepDesc: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: '#fff',
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 16,
    ...shadows.card,
  },
  ctaText: {
    fontFamily: fonts.manrope.bold,
    fontSize: 15,
    color: '#fff',
  },
});
