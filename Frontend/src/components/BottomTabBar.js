import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home', iconActive: 'home' },
  { key: 'search', label: 'Search', icon: 'magnify', iconActive: 'magnify' },
  { key: 'post', label: 'Post', icon: 'plus', iconActive: 'plus', isCenter: true },
  { key: 'saved', label: 'Saved', icon: 'heart-outline', iconActive: 'heart' },
  { key: 'account', label: 'Account', icon: 'account-outline', iconActive: 'account' },
];

export default function BottomTabBar({ activeTab = 'home', onTabPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const iconName = isActive ? tab.iconActive : tab.icon;

        if (tab.isCenter) {
          /* ── Post (plus) special raised button ── */
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.postBtn}
              activeOpacity={0.85}
              onPress={() => onTabPress?.(tab.key)}
            >
              <MaterialCommunityIcons name={iconName} size={28} color="#fff" />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onTabPress?.(tab.key)}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {/* Active dot indicator */}
            {isActive && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 2,
  },
  label: {
    fontFamily: fonts.inter.medium,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontFamily: fonts.inter.bold,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 1,
  },
  /* Center Post button */
  postBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
