// ===== Domain Types =====

export type PaymentMethod =
  | 'cash'
  | 'upi'
  | 'credit_card'
  | 'debit_card'
  | 'net_banking'
  | 'wallet'
  | 'other';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'other', label: 'Other' },
];

export interface Category {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
  groupName: string;
  isSystem: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryGroup {
  name: string;
  categories: Category[];
}

export interface Expense {
  id: string;
  amountPaise: number;
  categoryId: string;
  expenseDate: string; // YYYY-MM-DD local date
  note: string | null;
  merchant: string | null;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface MonthlyBudget {
  id: string;
  yearMonth: string; // YYYY-MM
  amountPaise: number;
  categoryId: string | null; // null = overall budget
  createdAt: string;
  updatedAt: string;
}

// ===== Aggregation Types =====

export interface MonthlyTotal {
  yearMonth: string;
  totalPaise: number;
  transactionCount: number;
}

export interface CategoryTotal {
  categoryId: string;
  category: Category;
  totalPaise: number;
  transactionCount: number;
  percentage: number;
}

export interface DashboardData {
  currentMonth: string; // YYYY-MM
  totalSpentPaise: number;
  transactionCount: number;
  avgDailySpendPaise: number;
  highestCategory: CategoryTotal | null;
  previousMonthTotalPaise: number;
  monthChangePercent: number | null; // null when prev month is 0
  categoryTotals: CategoryTotal[];
  recentExpenses: ExpenseWithCategory[];
  monthlyTotals: MonthlyTotal[];
}

export interface BudgetStatus {
  budget: MonthlyBudget;
  spentPaise: number;
  remainingPaise: number;
  percentUsed: number;
  isExceeded: boolean;
  category: Category | null; // null for overall budget
}

// ===== Filter Types =====

export interface ExpenseFilters {
  yearMonth?: string;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
  searchQuery?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

// ===== Form Types =====

export interface ExpenseFormData {
  amountRupees: string; // user input as string for editing
  categoryId: string;
  expenseDate: string; // YYYY-MM-DD
  note: string;
  merchant: string;
  paymentMethod: PaymentMethod | null;
}

export interface MonthlyTrend {
  yearMonth: string;
  monthLabel: string;
  totalPaise: number;
}

export interface DashboardSummary {
  totalPaise: number;
  transactionCount: number;
  dailyAveragePaise: number;
  topCategory: {
    categoryId: string;
    categoryName: string;
    categoryEmoji: string;
    totalPaise: number;
  } | null;
  monthOverMonthChangePercent: number | null;
  previousMonthTotalPaise: number;
}

