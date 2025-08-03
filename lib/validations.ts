import { z } from 'zod';

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
});

export const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const transactionSchema = z.object({
  transactionNo: z.string().min(1, 'Transaction number is required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['CREDIT', 'DEBIT']),
  description: z.string().optional(),
  accountId: z.number().int().positive('Account is required'),
  locationId: z.number().int().positive('Location is required'),
});

export type LocationInput = z.infer<typeof locationSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;