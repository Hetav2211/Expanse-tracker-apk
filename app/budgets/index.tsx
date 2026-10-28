// ===== Apple HIG Monthly Budget Configuration Screen =====
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
import { ArrowLeft, Plus, Target, Trash2, X } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useBudgets } from '../../src/hooks/useBudgets';
import { useCategories } from '../../src/hooks/useCategories';
import { getCurrentYearMonth } from '../../src/utils/dates';
import { formatINR, parseRupeesToPaise, paiseToRupees } from '../../src/utils/currency';
import { MonthSelector } from '../../src/components/MonthSelector';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { AmountInput } from '../../src/components/AmountInput';
import { CategoryPicker } from '../../src/components/CategoryPicker';
import { Category } from '../../src/types';
import { triggerSuccess } from '../../src/utils/haptics';

export default function BudgetsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const { overallStatus, categoryStatuses, saveBudget, removeBudget, loading } = useBudgets(selectedMonth);
  const { categories, groupedCategories } = useCategories();

  // Overall budget edit state
  const [editingOverall, setEditingOverall] = useState(false);
  const [overallAmountRupees, setOverallAmountRupees] = useState('');

  // Category budget modal
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [catAmountRupees, setCatAmountRupees] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  const handleSaveOverall = async () => {
    const paise = parseRupeesToPaise(overallAmountRupees);
    if (!paise || paise <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }

    try {
      await saveBudget(null, paise);
      triggerSuccess();
      setEditingOverall(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save overall budget.');
    }
  };

  const handleSaveCategoryBudget = async () => {
    if (!selectedCategory) {
      Alert.alert('Required', 'Please select a category.');
      return;
    }
    const paise = parseRupeesToPaise(catAmountRupees);
    if (!paise || paise <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }

    try {
      setSavingCat(true);
      await saveBudget(selectedCategory.id, paise);
      triggerSuccess();
      setCatModalVisible(false);
      setSelectedCategory(null);
      setCatAmountRupees('');
    } catch (e) {
      Alert.alert('Error', 'Failed to save category budget.');
    } finally {
      setSavingCat(false);
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
            Budgets
          </Text>

          <TouchableOpacity
            onPress={() => setCatModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add category budget limit"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.navButton}
          >
            <Plus size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Month Switcher */}
        <View style={{ paddingHorizontal: spacing.md }}>
          <MonthSelector currentMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
        >
        {/* Overall Monthly Budget */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              typography.footnote,
              { color: colors.textSecondary },
            ]}
          >
            OVERALL MONTHLY LIMIT
          </Text>

          {editingOverall ? (
            <Card variant="elevated">
              <AmountInput
                value={overallAmountRupees}
                onChangeValue={setOverallAmountRupees}
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setEditingOverall(false)}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Save Limit"
                  variant="primary"
                  onPress={handleSaveOverall}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          ) : overallStatus ? (
            <Card variant="elevated">
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[typography.amountLarge, { color: colors.textPrimary }]}>
                    {formatINR(overallStatus.budget.amountPaise, false)}
                  </Text>
                  <Text style={[typography.footnote, { color: colors.textSecondary, marginTop: 2, fontVariant: ['tabular-nums'] }]}>
                    {formatINR(overallStatus.spentPaise, false)} spent (
                    {Math.round(overallStatus.percentUsed)}%)
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: spacing.xs, alignItems: 'center' }}>
                  <Button
                    title="Edit"
                    size="sm"
                    variant="secondary"
                    onPress={() => {
                      setOverallAmountRupees(
                        paiseToRupees(overallStatus.budget.amountPaise).toString()
                      );
                      setEditingOverall(true);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeBudget(overallStatus.budget.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[
                      styles.trashBtn,
                      {
                        backgroundColor: colors.dangerLight,
                        borderRadius: br.sm,
                      },
                    ]}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Apple Progress Bar */}
              <View
                style={[
                  styles.progressBarTrack,
                  {
                    backgroundColor: colors.surfaceInset,
                    borderRadius: br.full,
                    marginTop: spacing.md,
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(overallStatus.percentUsed, 100)}%`,
                      backgroundColor: overallStatus.isExceeded
                        ? colors.danger
                        : overallStatus.percentUsed >= 80
                        ? colors.warning
                        : colors.success,
                      borderRadius: br.full,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  typography.caption1,
                  {
                    color: overallStatus.isExceeded ? colors.danger : colors.textSecondary,
                    marginTop: spacing.xs,
                    fontWeight: '500',
                    fontVariant: ['tabular-nums'],
                  },
                ]}
              >
                {overallStatus.isExceeded
                  ? `Exceeded by ${formatINR(Math.abs(overallStatus.remainingPaise), false)}`
                  : `${formatINR(overallStatus.remainingPaise, false)} remaining`}
              </Text>
            </Card>
          ) : (
            <Card
              variant="default"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <Text style={[typography.headline, { color: colors.textPrimary }]}>
                  No monthly limit set
                </Text>
                <Text style={[typography.footnote, { color: colors.textSecondary }]}>
                  Set a cap to receive warnings when you approach your limit.
                </Text>
              </View>
              <Button
                title="Set Limit"
                size="sm"
                variant="primary"
                onPress={() => {
                  setOverallAmountRupees('');
                  setEditingOverall(true);
                }}
              />
            </Card>
          )}
        </View>

        {/* Category-Specific Budgets */}
        <View>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                typography.footnote,
                { color: colors.textSecondary },
              ]}
            >
              CATEGORY BUDGETS
            </Text>
            <TouchableOpacity
              onPress={() => setCatModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Add category limit"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[typography.subhead, { color: colors.primary, fontWeight: '600' }]}>
                + Add Limit
              </Text>
            </TouchableOpacity>
          </View>

          {categoryStatuses.length === 0 ? (
            <Card variant="inset" style={{ alignItems: 'center', padding: spacing.lg }}>
              <Target size={26} color={colors.textTertiary} style={{ marginBottom: spacing.xs }} />
              <Text style={[typography.subhead, { color: colors.textSecondary, textAlign: 'center' }]}>
                No category budgets set for this month.
              </Text>
            </Card>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {categoryStatuses.map((st) => (
                <Card key={st.budget.id} variant="default">
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={[
                          styles.catIconWell,
                          {
                            backgroundColor: colors.surfaceInset,
                            borderRadius: br.sm,
                            borderWidth: 0.5,
                            borderColor: colors.specularHairline,
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 18 }}>{st.category?.emoji || '🏷️'}</Text>
                      </View>

                      <View>
                        <Text style={[typography.headline, { color: colors.textPrimary }]}>
                          {st.category?.name || 'Category'}
                        </Text>
                        <Text style={[typography.footnote, { color: colors.textSecondary, fontVariant: ['tabular-nums'] }]}>
                          {formatINR(st.spentPaise, false)} of {formatINR(st.budget.amountPaise, false)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeBudget(st.budget.id)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete budget for ${st.category?.name || 'Category'}`}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={[
                        styles.trashBtn,
                        {
                          backgroundColor: colors.dangerLight,
                          borderRadius: br.sm,
                        },
                      ]}
                    >
                      <Trash2 size={15} color={colors.danger} />
                    </TouchableOpacity>
                  </View>

                  {/* Apple Progress Bar */}
                  <View
                    style={[
                      styles.progressBarTrack,
                      {
                        backgroundColor: colors.surfaceInset,
                        borderRadius: br.full,
                        marginTop: spacing.sm,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(st.percentUsed, 100)}%`,
                          backgroundColor: st.isExceeded
                            ? colors.danger
                            : st.percentUsed >= 80
                            ? colors.warning
                            : colors.success,
                          borderRadius: br.full,
                        },
                      ]}
                    />
                  </View>

                  <View style={[styles.cardHeader, { marginTop: spacing.xxs }]}>
                    <Text
                      style={[
                        typography.caption1,
                        {
                          color: st.isExceeded ? colors.danger : colors.textTertiary,
                          fontWeight: st.isExceeded ? '600' : '400',
                          fontVariant: ['tabular-nums'],
                        },
                      ]}
                    >
                      {st.isExceeded
                        ? `Over by ${formatINR(Math.abs(st.remainingPaise), false)}`
                        : `${formatINR(st.remainingPaise, false)} remaining`}
                    </Text>
                    <Text style={[typography.caption1, { color: colors.textSecondary, fontWeight: '600', fontVariant: ['tabular-nums'] }]}>
                      {Math.round(st.percentUsed)}%
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      </View>

      {/* Add Category Budget Modal */}
      <Modal visible={catModalVisible} animationType="slide" transparent>
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
                Category Limit
              </Text>
              <TouchableOpacity
                onPress={() => setCatModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close category limit dialog"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacing.md, marginTop: spacing.md }}>
                <Text style={[typography.subhead, { color: colors.textSecondary, fontWeight: '500' }]}>
                  Select Category
                </Text>
                <CategoryPicker
                  categories={categories}
                  groupedCategories={groupedCategories}
                  selectedCategoryId={selectedCategory?.id || null}
                  onSelectCategory={setSelectedCategory}
                />

                <AmountInput
                  value={catAmountRupees}
                  onChangeValue={setCatAmountRupees}
                  showQuickPills={false}
                />

                <Button
                  title="Save Category Limit"
                  onPress={handleSaveCategoryBudget}
                  loading={savingCat}
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={{ marginTop: spacing.sm }}
                />
              </View>
            </ScrollView>
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
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    paddingHorizontal: 4,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trashBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  catIconWell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
