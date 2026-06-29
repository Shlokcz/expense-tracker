import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';

import * as expenseService from '../services/expense.service';
import { AuthRequest, CATEGORIES, EXPENSE_TYPES } from '../types';

export const createExpenseSchema = z.object({
  desc: z.string().min(1, 'Description is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(CATEGORIES),
  type: z.enum(EXPENSE_TYPES),
  date: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  desc: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
  category: z.enum(CATEGORIES).optional(),
  type: z.enum(EXPENSE_TYPES).optional(),
  date: z.string().optional(),
});

export const expenseQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  type: z.enum(EXPENSE_TYPES).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const expense = await expenseService.createExpense({
      userId: req.user!.userId,
      ...req.body,
    });
    res.status(httpStatus.CREATED).json({
      success: true,
      data: expense,
      message: 'Transaction created',
    });
  } catch (error) {
    next(error);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await expenseService.getExpenses(req.user!.userId, req.query as never);
    res.status(httpStatus.OK).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user!.userId);
    res.status(httpStatus.OK).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.user!.userId,
      req.body,
    );
    res.status(httpStatus.OK).json({
      success: true,
      data: expense,
      message: 'Transaction updated',
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await expenseService.deleteExpense(req.params.id, req.user!.userId);
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Transaction deleted',
    });
  } catch (error) {
    next(error);
  }
}

export async function summary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await expenseService.getSummary(req.user!.userId);
    res.status(httpStatus.OK).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
