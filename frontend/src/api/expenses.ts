import client from './client';
import { ApiResponse, Expense, ExpenseListResponse, Summary } from '../types';

export interface ExpenseInput {
  desc: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date?: string;
}

export interface ExpenseQuery {
  category?: string;
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getExpenses(query: ExpenseQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, val]) => {
    if (val !== undefined && val !== '') {
      params.set(key, String(val));
    }
  });
  const { data } = await client.get<ExpenseListResponse>(
    `/expenses?${params.toString()}`,
  );
  return data;
}

export async function getSummary() {
  const { data } = await client.get<ApiResponse<Summary>>('/expenses/summary');
  return data;
}

export async function createExpense(input: ExpenseInput) {
  const { data } = await client.post<ApiResponse<Expense>>('/expenses', input);
  return data;
}

export async function updateExpense(id: string, input: Partial<ExpenseInput>) {
  const { data } = await client.put<ApiResponse<Expense>>(`/expenses/${id}`, input);
  return data;
}

export async function deleteExpense(id: string) {
  const { data } = await client.delete<ApiResponse<void>>(`/expenses/${id}`);
  return data;
}
