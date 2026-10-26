import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius, shadows } from '../theme';

function CityTile({ city, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.9 }]}
      onPress={() => onPress?.(city)}
      accessibilityRole="button"
      accessibilityLabel={`${city.name}, ${city.count}`}
    >
      <ImageBackground source={{ uri: city.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,38,32,0)', 'rgba(0,38,32,0.4)', 'rgba(0,38,32,0.9)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.text}>
        <Text style={styles.name}>{city.name}</Text>
        <Text style={styles.count}>{city.count}</Text>
      </View>
    </Pressable>
  );
}

/** 2-column grid. Plain flex-wrap (no nested FlatList inside the ScrollView). */
export default function CityGrid({ cities, onPressCity }) {
  return (
    <View style={styles.grid}>
      {cities.map((c) => (
        <CityTile key={c.id} city={c} onPress={onPressCity} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '48.3%', // two columns with a 12px gap on a 350px-wide container
    height: 126.75,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: colors.primaryDark,
    ...shadows.soft,
  },
  text: {},
  name: { fontFamily: fonts.inter.bold, fontSize: 15, lineHeight: 18.75, color: colors.white },
  count: { fontFamily: fonts.inter.medium, fontSize: 11, lineHeight: 14, color: colors.sage },
});
