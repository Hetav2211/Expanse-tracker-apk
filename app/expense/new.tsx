// ===== Apple HIG Add Expense Modal Screen =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '../../src/components/AppSafeAreaView';
import { useRouter } from 'expo-router';
import { Calendar, Store, FileText } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useCategories } from '../../src/hooks/useCategories';
import { AmountInput } from '../../src/components/AmountInput';
import { CategoryPicker } from '../../src/components/CategoryPicker';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { parseRupeesToPaise } from '../../src/utils/currency';
import { todayDateString } from '../../src/utils/dates';
import { PAYMENT_METHODS, PaymentMethod, Category } from '../../src/types';
import { triggerSuccess, triggerSelection, triggerError } from '../../src/utils/haptics';

export default function NewExpenseScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const { addExpense } = useExpenses();
  const { categories, groupedCategories } = useCategories();

  const [amountRupees, setAmountRupees] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expenseDate, setExpenseDate] = useState<string>(todayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>('upi');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [categoryError, setCategoryError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    let hasError = false;
    setAmountError(undefined);
    setCategoryError(undefined);

    const amountPaise = parseRupeesToPaise(amountRupees);
    if (!amountPaise || amountPaise <= 0) {
      setAmountError('Please enter a valid amount greater than ₹0');
      hasError = true;
    }

    if (!selectedCategory) {
      setCategoryError('Please select a category');
      hasError = true;
    }

    if (hasError) {
      triggerError();
      return;
    }

    try {
      setSubmitting(true);
      await addExpense({
        amountPaise: amountPaise!,
        categoryId: selectedCategory!.id,
        expenseDate,
        paymentMethod,
        merchant: merchant.trim() || null,
        note: note.trim() || null,
      });

      triggerSuccess();
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppSafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Apple Modal Navigation Bar */}
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
              accessibilityLabel="Cancel adding expense"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={[typography.body, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <Text style={[typography.headline, { color: colors.textPrimary }]}>
              New Expense
            </Text>

            <TouchableOpacity
              onPress={handleSave}
              disabled={submitting}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Done and save expense"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text
                style={[
                  typography.headline,
                  {
                    color: submitting ? colors.textTertiary : colors.primary,
                    fontWeight: '600',
                  },
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
          >
          {/* Amount Input */}
          <AmountInput
            value={amountRupees}
            onChangeValue={(val) => {
              setAmountRupees(val);
              if (amountError) setAmountError(undefined);
            }}
            error={amountError}
          />

          {/* Category Picker */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[typography.subhead, { color: colors.textSecondary, fontWeight: '500' }]}>
                Category
              </Text>
              {selectedCategory && (
                <Text style={[typography.footnote, { color: colors.primary, fontWeight: '600' }]}>
                  {selectedCategory.emoji} {selectedCategory.name}
                </Text>
              )}
            </View>

            {categoryError ? (
              <Text
                style={[
                  typography.caption1,
                  { color: colors.danger, marginBottom: spacing.xs, fontWeight: '500' },
                ]}
              >
                {categoryError}
              </Text>
            ) : null}

            <CategoryPicker
              categories={categories}
              groupedCategories={groupedCategories}
              selectedCategoryId={selectedCategory?.id || null}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                if (categoryError) setCategoryError(undefined);
              }}
            />
          </View>

          {/* Date Selector */}
          <View>
            <Text style={[typography.subhead, { color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '500' }]}>
              Date
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {[
                { label: 'Today', date: todayDateString() },
                {
                  label: 'Yesterday',
                  date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
                },
              ].map((item) => {
                const isSelected = expenseDate === item.date;
                return (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => {
                      triggerSelection();
                      setExpenseDate(item.date);
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Date ${item.label}`}
                    style={[
                      styles.datePill,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surfaceInset,
                        borderRadius: br.full,
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.sm,
                        borderWidth: 0.5,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.specularHairline,
                      },
                    ]}
                  >
                    <Calendar
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        typography.subhead,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Payment Method */}
          <View>
            <Text style={[typography.subhead, { color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '500' }]}>
              Payment Method
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.xs, paddingVertical: 2 }}
            >
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.value;
                return (
                  <TouchableOpacity
                    key={pm.value}
                    onPress={() => {
                      triggerSelection();
                      setPaymentMethod(pm.value);
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Payment method ${pm.label}`}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    style={[
                      styles.methodPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceInset,
                        borderRadius: br.full,
                        paddingHorizontal: spacing.md,
                        paddingVertical: 7,
                        borderWidth: 0.5,
                        borderColor: isSelected ? 'transparent' : colors.specularHairline,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption1,
                        {
                          color: isSelected ? '#FFFFFF' : colors.textPrimary,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                    >
                      {pm.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Merchant / Place */}
          <Input
            label="Merchant / Place (Optional)"
            placeholder="e.g. Swiggy, DMart, Shell"
            value={merchant}
            onChangeText={setMerchant}
            leftIcon={<Store size={16} color={colors.textTertiary} />}
            showClear
            onClear={() => setMerchant('')}
          />

          {/* Note */}
          <Input
            label="Note (Optional)"
            placeholder="e.g. Team dinner, weekly vegetables"
            value={note}
            onChangeText={setNote}
            leftIcon={<FileText size={16} color={colors.textTertiary} />}
            showClear
            onClear={() => setNote('')}
          />

          {/* Save Button */}
          <Button
            title="Save Expense"
            onPress={handleSave}
            loading={submitting}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: spacing.sm }}
          />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
  content: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
