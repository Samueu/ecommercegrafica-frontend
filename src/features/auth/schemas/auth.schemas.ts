import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export const recoverPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;
