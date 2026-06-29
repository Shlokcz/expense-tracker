import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ExpenseFilters {
  category?: string;
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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

export const EXPENSE_TYPES = ['income', 'expense'] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
