import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

/**
 * Title (+ optional subtitle) on the left, optional action link on the right.
 */
export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  titleSize = 20,
  trailingText, // small caption instead of a link, e.g. "Tap to filter"
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {!!actionLabel && (
        <Pressable style={styles.action} onPress={onActionPress} hitSlop={8}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.primary} />
        </Pressable>
      )}
      {!!trailingText && <Text style={styles.trailing}>{trailingText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  left: { flex: 1, paddingRight: 12 },
  title: {
    fontFamily: fonts.manrope.bold,
    color: colors.primaryDark,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  action: { flexDirection: 'row', alignItems: 'center', paddingBottom: 2 },
  actionText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    textAlign: 'right',
  },
  trailing: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    paddingBottom: 6,
  },
});
