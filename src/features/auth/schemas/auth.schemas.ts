import { z } from 'zod';

/**
 * Mesma política aplicada no backend (PasswordPolicy.cs).
 * 8+ chars, com letra maiúscula, minúscula, número e símbolo.
 */
const strongPassword = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(128, 'A senha não pode ter mais de 128 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
  .regex(/\d/, 'A senha deve conter pelo menos um número.')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um símbolo (!@#$…).');

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nome obrigatório'),
    email: z.email('E-mail inválido'),
    phone: z
      .string()
      .trim()
      .max(20, 'Telefone muito longo')
      .optional()
      .or(z.literal('')),
    password: strongPassword,
    confirmPassword: z.string(),
    consent: z.boolean().refine((v) => v === true, {
      message: 'É necessário aceitar o tratamento de dados (LGPD).',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

export const recoverPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;
