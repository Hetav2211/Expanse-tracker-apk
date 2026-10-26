// ===== Apple HIG Edit / Delete Expense Screen =====
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Trash2, Calendar, Store, FileText } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useCategories } from '../../src/hooks/useCategories';
import { AmountInput } from '../../src/components/AmountInput';
import { CategoryPicker } from '../../src/components/CategoryPicker';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { parseRupeesToPaise, paiseToRupees } from '../../src/utils/currency';
import { PAYMENT_METHODS, PaymentMethod, Category } from '../../src/types';
import { triggerSuccess, triggerError, triggerSelection } from '../../src/utils/haptics';

export default function EditExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const { editExpense, removeExpense, getExpenseById } = useExpenses();
  const { categories, groupedCategories } = useCategories();

  const [loading, setLoading] = useState(true);
  const [amountRupees, setAmountRupees] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expenseDate, setExpenseDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const expense = await getExpenseById(id);
        if (expense) {
          setAmountRupees(paiseToRupees(expense.amountPaise).toString());
          setSelectedCategory(expense.category);
          setExpenseDate(expense.expenseDate);
          setPaymentMethod(expense.paymentMethod);
          setMerchant(expense.merchant || '');
          setNote(expense.note || '');
        } else {
          Alert.alert('Not Found', 'Expense could not be found.');
          router.back();
        }
      } catch (e) {
        console.error('Error loading expense:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    const amountPaise = parseRupeesToPaise(amountRupees);
    if (!amountPaise || amountPaise <= 0) {
      setAmountError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Required', 'Please select a category.');
      return;
    }

    try {
      setSubmitting(true);
      await editExpense(id, {
        amountPaise,
        categoryId: selectedCategory.id,
        expenseDate,
        paymentMethod,
        merchant: merchant.trim() || null,
        note: note.trim() || null,
      });

      triggerSuccess();
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    triggerError();
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to permanently delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              setDeleting(true);
              await removeExpense(id);
              triggerSuccess();
              router.back();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete expense.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[typography.body, { color: colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <Text style={[typography.headline, { color: colors.textPrimary }]}>
            Edit Expense
          </Text>

          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Trash2 size={18} color={colors.danger} />
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

            <CategoryPicker
              categories={categories}
              groupedCategories={groupedCategories}
              selectedCategoryId={selectedCategory?.id || null}
              onSelectCategory={setSelectedCategory}
            />
          </View>

          {/* Date */}
          <Input
            label="Date (YYYY-MM-DD)"
            value={expenseDate}
            onChangeText={setExpenseDate}
            leftIcon={<Calendar size={16} color={colors.textTertiary} />}
          />

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
                    style={[
                      styles.methodPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceInset,
                        borderRadius: br.full,
                        paddingHorizontal: spacing.md,
                        paddingVertical: 7,
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

          {/* Merchant */}
          <Input
            label="Merchant / Place"
            placeholder="e.g. Swiggy, DMart"
            value={merchant}
            onChangeText={setMerchant}
            leftIcon={<Store size={16} color={colors.textTertiary} />}
            showClear
            onClear={() => setMerchant('')}
          />

          {/* Note */}
          <Input
            label="Note"
            placeholder="e.g. Coffee with friends"
            value={note}
            onChangeText={setNote}
            leftIcon={<FileText size={16} color={colors.textTertiary} />}
            showClear
            onClear={() => setNote('')}
          />

          {/* Action Buttons */}
          <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
            <Button
              title="Save Changes"
              onPress={handleUpdate}
              loading={submitting}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Delete Expense"
              onPress={handleDelete}
              loading={deleting}
              variant="danger"
              size="lg"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  methodPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
