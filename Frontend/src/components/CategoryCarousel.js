import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SectionHeader from './SectionHeader';
import { colors, fonts, radius, shadows, spacing } from '../theme';

function CategoryCard({ item, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
    >
      <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
        <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
      </View>
      <View style={{ gap: 2 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.count}>{item.count}</Text>
      </View>
    </Pressable>
  );
}

export default function CategoryCarousel({ data, onPressCategory }) {
  return (
    <View style={styles.section}>
      <View style={{ paddingHorizontal: spacing.screen }}>
        <SectionHeader title="Explore by Category" titleSize={18} />
        {/* trailingText="Tap to filter" */}
      </View>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <CategoryCard item={item} onPress={onPressCategory} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 4, gap: 10 },
  list: { paddingHorizontal: spacing.screen, paddingBottom: 8 },
  card: {
    width: 136,
    minHeight: 126.5,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadows.soft,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontFamily: fonts.inter.bold, fontSize: 13, lineHeight: 16.25, color: colors.textPrimary },
  count: { fontFamily: fonts.inter.medium, fontSize: 11, lineHeight: 14, color: colors.textSecondary },
});
