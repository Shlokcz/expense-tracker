import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
  ExpenseQuery,
  ExpenseInput,
} from '../api/expenses';

export function useExpenses(query: ExpenseQuery = {}) {
  return useQuery({
    queryKey: ['expenses', query],
    queryFn: () => getExpenses(query),
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    refetchInterval: 30000,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ExpenseInput) => createExpense(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ExpenseInput> }) =>
      updateExpense(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
