export type TransactionType = 'sale' | 'expense' | 'credit';
export type TransactionChannel = 'mobile_money' | 'cash' | 'bank';
export type CreditStatus = 'open' | 'paid';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  channel: TransactionChannel;
  amount: string; // numeric comes back as string from postgres
  category: string;
  counterparty_name: string | null;
  counterparty_phone: string | null;
  note: string | null;
  credit_status: CreditStatus | null;
  paid_at: string | null;
  created_at: string;
}

export interface NewTransactionInput {
  type: TransactionType;
  channel: TransactionChannel;
  amount: number;
  category: string;
  counterparty_name?: string;
  counterparty_phone?: string;
  note?: string;
}

export const CATEGORY_OPTIONS = [
  'sale',
  'stock',
  'transport',
  'utilities',
  'rent',
  'other',
] as const;
