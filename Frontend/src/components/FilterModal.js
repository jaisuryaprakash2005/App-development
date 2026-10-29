import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';

/**
 * Reusable bottom-sheet filter picker.
 *
 * Props:
 *   visible      {boolean}   - controls modal visibility
 *   title        {string}    - modal heading
 *   options      {Array}     - [{ id, label }]
 *   selected     {string[]}  - array of selected ids
 *   onSelect     {fn}        - called with new selected ids array
 *   onClose      {fn}        - called when modal closes
 *   multiSelect  {boolean}   - allow multiple selections (default false)
 */
export default function FilterModal({
  visible,
  title,
  options = [],
  selected = [],
  onSelect,
  onClose,
  multiSelect = false,
}) {
  const insets = useSafeAreaInsets();

  function handlePress(id) {
    if (multiSelect) {
      const next = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
      onSelect(next);
    } else {
      onSelect([id]);
      onClose();
    }
  }

  function handleClear() {
    onSelect([]);
    if (!multiSelect) onClose();
  }

  const hasSelection = selected.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerRight}>
            {hasSelection && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={handleClear}
                hitSlop={8}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options list */}
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                activeOpacity={0.7}
                onPress={() => handlePress(opt.id)}
              >
                {/* Left: radio / checkbox indicator */}
                <View style={[
                  styles.indicator,
                  isSelected && styles.indicatorSelected,
                ]}>
                  {isSelected && (
                    <MaterialCommunityIcons
                      name={multiSelect ? 'check' : 'circle'}
                      size={multiSelect ? 12 : 10}
                      color="#fff"
                    />
                  )}
                </View>

                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.label}
                </Text>

                {isSelected && (
                  <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Apply button (multiSelect only) */}
        {multiSelect && (
          <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.applyText}>
              Apply{hasSelection ? ` (${selected.length} selected)` : ''}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '78%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: fonts.manrope.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  clearBtn: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  clearText: {
    fontFamily: fonts.inter.semibold,
    fontSize: 13,
    color: colors.primary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    marginBottom: 6,
    backgroundColor: colors.background,
  },
  optionSelected: {
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}35`,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.inter.medium,
    fontSize: 15,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: fonts.inter.bold,
  },
  applyBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontFamily: fonts.manrope.bold,
    fontSize: 15,
    color: '#fff',
  },
});
