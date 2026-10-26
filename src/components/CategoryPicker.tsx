// ===== Apple HIG Category Picker Component =====
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { Category, CategoryGroup } from '../types';
import { Search, Check } from 'lucide-react-native';
import { triggerSelection, triggerLightImpact } from '../utils/haptics';

export interface CategoryPickerProps {
  categories: Category[];
  groupedCategories: CategoryGroup[];
  selectedCategoryId: string | null;
  onSelectCategory: (category: Category) => void;
  style?: ViewStyle;
}

export function CategoryPicker({
  categories,
  groupedCategories,
  selectedCategoryId,
  onSelectCategory,
  style,
}: CategoryPickerProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('All');

  const filteredCategories = useMemo(() => {
    let list = categories;

    if (activeGroup !== 'All') {
      list = list.filter((c) => c.groupName === activeGroup);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.groupName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [categories, activeGroup, searchQuery]);

  const groupNames = useMemo(() => {
    return ['All', ...groupedCategories.map((g) => g.name)];
  }, [groupedCategories]);

  const handleSelect = (category: Category) => {
    triggerSelection();
    onSelectCategory(category);
  };

  return (
    <View style={[styles.container, style]}>
      {/* iOS Style Search Bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.inputBg,
            borderRadius: br.sm,
            paddingHorizontal: spacing.sm,
            marginBottom: spacing.sm,
          },
        ]}
      >
        <Search size={15} color={colors.textTertiary} style={{ marginRight: spacing.xs }} />
        <TextInput
          placeholder="Search categories..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, typography.subhead, { color: colors.textPrimary }]}
        />
      </View>

      {/* iOS Segmented / Pill Filter Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.groupScroll, { gap: spacing.xs, marginBottom: spacing.sm }]}
      >
        {groupNames.map((group) => {
          const isActive = activeGroup === group;
          return (
            <TouchableOpacity
              key={group}
              onPress={() => {
                triggerLightImpact();
                setActiveGroup(group);
              }}
              activeOpacity={0.7}
              style={[
                styles.groupChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceInset,
                  borderRadius: br.full,
                  paddingHorizontal: spacing.md,
                  paddingVertical: 6,
                },
              ]}
            >
              <Text
                style={[
                  typography.caption1,
                  {
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isActive ? '600' : '500',
                  },
                ]}
              >
                {group}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Categories Inset Grid */}
      <ScrollView
        style={styles.gridScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={[styles.grid, { gap: spacing.sm }]}>
          {filteredCategories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleSelect(cat)}
                activeOpacity={0.7}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surfaceElevated,
                    borderRadius: br.md,
                    padding: spacing.sm,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? colors.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    typography.caption1,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontWeight: isSelected ? '600' : '400',
                      marginTop: 4,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
                {isSelected ? (
                  <View
                    style={[
                      styles.checkBadge,
                      { backgroundColor: colors.primary, borderRadius: br.full },
                    ]}
                  >
                    <Check size={9} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 300,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  groupScroll: {
    paddingVertical: 2,
  },
  groupChip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridScroll: {
    maxHeight: 210,
    paddingVertical: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 68,
    position: 'relative',
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
