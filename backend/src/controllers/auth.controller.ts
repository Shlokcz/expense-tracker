import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';

import * as authService from '../services/auth.service';
import { AuthRequest } from '../types';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name, password } = req.body;
    const result = await authService.registerUser(email, name, password);
    res.status(httpStatus.CREATED).json({
      success: true,
      data: result,
      message: 'Registration successful',
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(httpStatus.OK).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(httpStatus.OK).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
}
