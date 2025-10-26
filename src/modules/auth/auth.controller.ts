import { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../../common/errors/AppError';
import { authService } from './auth.service';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError('Datos inválidos', 422, parsed.error.flatten());
  const user = await authService.register(parsed.data);
  return res.status(201).json({ user });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError('Credenciales inválidas', 422, parsed.error.flatten());
  const session = await authService.login(parsed.data);
  return res.status(200).json(session);
}
