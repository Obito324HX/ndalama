import Link from 'next/link';
import { sql } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import { Transaction } from '@/lib/types';

async function getAllTransactions() {
  const userId = await requireUserId();

  const rows = (await sql`
    select *
    from transactions
    where user_id = ${userId}
    order by created_at desc
    limit 200
  `) as Transaction[];

  return rows;
}

function groupByDate(rows: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const t of rows) {
    const key = new Date(t.created_at).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return groups;
}

export default async function HistoryPage() {
  const rows = await getAllTransactions();
  const groups = groupByDate(rows);
  const dates = Object.keys(groups);

  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-baseline justify-between border-b border-ink/10 pb-3">
        <h1 className="font-serif text-lg font-semibold">History</h1>
        <Link href="/" className="font-mono text-[11px] text-gray-500">
          Back
        </Link>
      </header>

      {dates.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">No entries yet.</p>
      )}

      {dates.map((date) => (
        <section key={date} className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">{date}</p>
          <ul>
            {groups[date].map((t) => (
              <li key={t.id} className="border-b border-dashed border-ink/10 py-2">
                <Link href={`/transactions/${t.id}/edit`} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.counterparty_name ?? '—'}</p>
                    <p className="font-mono text-[10px] text-gray-500">
                      {t.type} · {t.channel.replace('_', ' ')}
                      {t.type === 'credit' && t.credit_status === 'paid' ? ' · paid' : ''}
                    </p>
                  </div>
                  <p
                    className={`font-mono text-sm font-semibold ${
                      t.type === 'sale'
                        ? 'text-green-700'
                        : t.type === 'expense'
                        ? 'text-rust'
                        : 'text-amber-600'
                    }`}
                  >
                    {t.type === 'expense' ? '−' : '+'}K {Number(t.amount).toFixed(2)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
