// ===== Apple HIG Categories Management Screen =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { AppSafeAreaView } from '../../src/components/AppSafeAreaView';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Archive, ArchiveRestore, X } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useCategories } from '../../src/hooks/useCategories';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { triggerSuccess, triggerMediumImpact } from '../../src/utils/haptics';

export default function CategoriesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [includeArchived, setIncludeArchived] = useState(false);
  const { groupedCategories, addCategory, archiveCategory, restoreCategory } = useCategories(includeArchived);

  // Add category modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🏷️');
  const [newCatGroup, setNewCatGroup] = useState('Custom');
  const [creating, setCreating] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }

    try {
      setCreating(true);
      await addCategory({
        name: newCatName.trim(),
        emoji: newCatEmoji.trim() || '🏷️',
        iconName: 'tag',
        groupName: newCatGroup.trim() || 'Custom',
      });
      triggerSuccess();
      setModalVisible(false);
      setNewCatName('');
    } catch (e) {
      Alert.alert('Error', 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  };

  const handleArchiveToggle = (id: string, isArchived: boolean) => {
    triggerMediumImpact();
    if (isArchived) {
      restoreCategory(id);
    } else {
      Alert.alert(
        'Archive Category',
        'Archiving hides this category from pickers, but keeps past transactions safe.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Archive', style: 'destructive', onPress: () => archiveCategory(id) },
        ]
      );
    }
  };

  return (
    <AppSafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        {/* Apple Navigation Bar */}
        <View
          style={[
            styles.header,
            {
              paddingHorizontal: spacing.lg,
              borderBottomColor: colors.separator,
              borderBottomWidth: 0.5,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.navButton}
          >
            <ArrowLeft size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[typography.headline, { color: colors.textPrimary }]}>
            Categories
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add custom category"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.navButton}
          >
            <Plus size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Archive Filter Toggle */}
        <View
          style={[
            styles.toggleRow,
            { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
          ]}
        >
          <TouchableOpacity
            onPress={() => setIncludeArchived(!includeArchived)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Toggle showing archived categories"
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            style={[
              styles.archiveFilterChip,
              {
                backgroundColor: includeArchived ? colors.primaryLight : colors.surfaceInset,
                borderRadius: br.full,
                paddingHorizontal: spacing.md,
                paddingVertical: 6,
                borderWidth: 0.5,
                borderColor: includeArchived ? 'transparent' : colors.specularHairline,
              },
            ]}
          >
            <Text
              style={[
                typography.caption1,
                {
                  color: includeArchived ? colors.primary : colors.textSecondary,
                  fontWeight: includeArchived ? '600' : '400',
                },
              ]}
            >
              {includeArchived ? 'Showing Archived' : 'Show Archived'}
            </Text>
          </TouchableOpacity>
        </View>

      {/* Grouped Categories List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
      >
        {groupedCategories.map((group) => (
          <View key={group.name}>
            <Text
              style={[
                styles.groupHeader,
                typography.footnote,
                { color: colors.textSecondary },
              ]}
            >
              {group.name.toUpperCase()}
            </Text>

            <Card variant="default" padding="none">
              {group.categories.map((cat, idx) => (
                <React.Fragment key={cat.id}>
                  <View
                    style={[
                      styles.catRow,
                      {
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        opacity: cat.isArchived ? 0.45 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.catIconWell,
                        {
                          backgroundColor: colors.surfaceInset,
                          borderRadius: br.sm,
                        },
                      ]}
                    >
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    </View>

                    <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                      <Text
                        style={[
                          typography.body,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {cat.name}
                      </Text>
                      {cat.isArchived && (
                        <Text style={[typography.caption2, { color: colors.danger, fontWeight: '600' }]}>
                          Archived
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => handleArchiveToggle(cat.id, cat.isArchived)}
                      accessibilityRole="button"
                      accessibilityLabel={cat.isArchived ? `Restore ${cat.name}` : `Archive ${cat.name}`}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={{ padding: 4 }}
                    >
                      {cat.isArchived ? (
                        <ArchiveRestore size={18} color={colors.primary} />
                      ) : (
                        <Archive size={18} color={colors.textTertiary} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {idx < group.categories.length - 1 && (
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: colors.separator,
                          marginLeft: 36 + spacing.md + spacing.sm,
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
      </View>

      {/* Add Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalDialog,
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: br['2xl'],
                padding: spacing.xl,
                borderWidth: 0.5,
                borderColor: colors.specularHairline,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[typography.headline, { color: colors.textPrimary }]}>
                New Category
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close new category dialog"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: spacing.md, marginTop: spacing.md }}>
              <Input
                label="Emoji Icon"
                value={newCatEmoji}
                onChangeText={setNewCatEmoji}
                maxLength={4}
              />

              <Input
                label="Category Name"
                placeholder="e.g. Gym & Fitness"
                value={newCatName}
                onChangeText={setNewCatName}
              />

              <Input
                label="Group"
                placeholder="e.g. Health & Wellness"
                value={newCatGroup}
                onChangeText={setNewCatGroup}
              />

              <Button
                title="Create Category"
                onPress={handleCreateCategory}
                loading={creating}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  archiveFilterChip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  groupHeader: {
    paddingHorizontal: 4,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  catIconWell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 20,
  },
  separator: {
    height: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalDialog: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
