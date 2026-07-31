import Link from 'next/link';
import { sql } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import { Transaction } from '@/lib/types';
import MarkPaidButton from './MarkPaidButton';

function daysAgo(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
}

async function getOpenCredit() {
  const userId = await requireUserId();

  const rows = (await sql`
    select *
    from transactions
    where user_id = ${userId}
      and type = 'credit'
      and credit_status = 'open'
    order by created_at asc
  `) as Transaction[];

  const total = rows.reduce((sum, t) => sum + Number(t.amount), 0);

  return { rows, total };
}

export default async function CreditPage() {
  const { rows, total } = await getOpenCredit();

  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-baseline justify-between border-b border-ink/10 pb-3">
        <h1 className="font-serif text-lg font-semibold">Credit given</h1>
        <Link href="/dashboard" className="font-mono text-[11px] text-gray-500">
          Back
        </Link>
      </header>

      <div className="my-5 rounded-xl bg-ink/5 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gray-500">Total outstanding</p>
        <p className="font-mono text-3xl font-semibold text-rust">K {total.toFixed(2)}</p>
        <p className="mt-1 font-mono text-[10px] text-gray-500">{rows.length} open</p>
      </div>

      <ul>
        {rows.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-500">
            No outstanding credit — everything's settled.
          </li>
        )}
        {rows.map((t) => (
          <li key={t.id} className="flex justify-between border-b border-ink/10 py-3">
            <div>
              <p className="text-[13.5px] font-medium">{t.counterparty_name ?? 'Unnamed'}</p>
              <p className="font-mono text-[10.5px] text-gray-500">
                {daysAgo(t.created_at)} days outstanding
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[13.5px] font-semibold text-rust">
                K {Number(t.amount).toFixed(2)}
              </p>
              <MarkPaidButton id={t.id} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
