import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TransactionTabs from './TransactionTabs';
import SearchCard from './SearchCard';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { TRANSACTION_MODES } from '../data/mockData';

export default function HeroSection({ mode, onChangeMode, searchProps }) {
  return (
    <View style={styles.wrap}>
      {/* Soft green wash that replaces the blurred glow circles from Figma */}
      <LinearGradient
        colors={['rgba(216,232,199,0.55)', 'rgba(246,243,236,0)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.content}>
        <View>
          {/* h1 / sub can be re-enabled here */}
        </View>

        <View style={{ paddingTop: 4 }}>
          <TransactionTabs modes={TRANSACTION_MODES} selected={mode} onChange={onChangeMode} />
        </View>

        <View style={{ paddingTop: 4 }}>
          <SearchCard {...searchProps} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 8, paddingBottom: 24, paddingHorizontal: spacing.screen },
  content: { gap: 8 },
  h1: {
    fontFamily: fonts.manrope.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.65,
    color: colors.primaryDark,
  },
  sub: {
    marginTop: 6,
    fontFamily: fonts.manrope.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
