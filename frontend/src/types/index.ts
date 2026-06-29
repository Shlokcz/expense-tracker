export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface Expense {
  id: string;
  userId: string;
  desc: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExpenseListResponse {
  success: boolean;
  data: Expense[];
  pagination: Pagination;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface Summary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
