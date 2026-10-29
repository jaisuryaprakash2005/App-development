import React from 'react';
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

const MENU_ITEMS = [
  { icon: 'account-edit-outline', label: 'Edit Profile' },
  { icon: 'heart-outline', label: 'Saved Properties' },
  { icon: 'home-plus-outline', label: 'My Listings' },
  { icon: 'bell-outline', label: 'Notifications' },
  { icon: 'shield-lock-outline', label: 'Privacy & Security' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'information-outline', label: 'About ProBridge' },
];

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.menuIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Account</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sign in to access your account</Text>
          </View>
          <TouchableOpacity style={styles.signInBtn} activeOpacity={0.85}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: '0', label: 'Saved' },
            { value: '0', label: 'Listings' },
            { value: '0', label: 'Enquiries' },
          ].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <MenuItem icon={item.icon} label={item.label} />
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="logout" size={18} color="#e53935" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer note */}
        <Text style={styles.version}>ProBridge v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 100,
  },

  header: { marginBottom: 16 },
  heading: {
    fontFamily: fonts.manrope.bold,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },

  /* Profile card */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadows.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  signInText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    color: '#fff',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    marginBottom: 14,
    ...shadows.card,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(0,0,0,0.08)',
  },
  statValue: {
    fontFamily: fonts.manrope.bold,
    fontSize: 22,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* Menu */
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    marginBottom: 14,
    overflow: 'hidden',
    ...shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 66,
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fde0df',
    ...shadows.soft,
  },
  logoutText: {
    fontFamily: fonts.inter.bold,
    fontSize: 14,
    color: '#e53935',
  },

  version: {
    textAlign: 'center',
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
});
