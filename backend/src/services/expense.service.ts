import { PrismaClient } from '@prisma/client';

import { ExpenseFilters } from '../types';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

interface CreateExpenseInput {
  userId: string;
  desc: string;
  amount: number;
  category: string;
  type: string;
  date?: string;
}

interface UpdateExpenseInput {
  desc?: string;
  amount?: number;
  category?: string;
  type?: string;
  date?: string;
}

export async function createExpense(data: CreateExpenseInput) {
  return prisma.expense.create({
    data: {
      userId: data.userId,
      desc: data.desc,
      amount: data.amount,
      category: data.category,
      type: data.type,
      date: data.date ? new Date(data.date) : new Date(),
    },
  });
}

export async function getExpenses(userId: string, filters: ExpenseFilters) {
  const where: Record<string, unknown> = { userId };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.startDate || filters.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.date = dateFilter;
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getExpenseById(id: string, userId: string) {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });
  if (!expense) {
    throw new NotFoundError('Expense not found');
  }
  return expense;
}

export async function updateExpense(id: string, userId: string, data: UpdateExpenseInput) {
  await getExpenseById(id, userId);
  return prisma.expense.update({
    where: { id },
    data: {
      ...data,
      ...(data.date ? { date: new Date(data.date) } : {}),
    },
  });
}

export async function deleteExpense(id: string, userId: string) {
  await getExpenseById(id, userId);
  await prisma.expense.delete({ where: { id } });
}

export async function getSummary(userId: string) {
  const expenses = await prisma.expense.findMany({ where: { userId } });

  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Record<string, number> = {};
  expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    transactionCount: expenses.length,
    categoryBreakdown,
  };
}
