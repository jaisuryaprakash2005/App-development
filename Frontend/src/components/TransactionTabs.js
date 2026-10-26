import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadows } from '../theme';

/** Segmented control: Buy / Rent / Commercial / Projects */
export default function TransactionTabs({ modes, selected, onChange }) {
  return (
    <View style={styles.track}>
      {modes.map((mode) => {
        const active = mode === selected;
        return (
          <Pressable
            key={mode}
            onPress={() => onChange(mode)}
            style={[styles.tab, active && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, active ? styles.labelActive : styles.labelInactive]}
            >
              {mode}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.primary, ...shadows.soft },
  label: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  labelActive: { fontFamily: fonts.inter.semibold, color: colors.white },
  labelInactive: { fontFamily: fonts.inter.medium, color: colors.textSecondary },
});
