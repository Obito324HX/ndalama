import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import { Transaction } from '@/lib/types';
import EditTransactionForm from './EditTransactionForm';

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireUserId();
  const { id } = await params;

  const [transaction] = (await sql`
    select * from transactions where id = ${id} and user_id = ${userId}
  `) as Transaction[];

  if (!transaction) {
    redirect('/history');
  }

  return <EditTransactionForm transaction={transaction} />;
}
