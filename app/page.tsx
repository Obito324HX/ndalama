import Link from 'next/link';
import { sql } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import { Transaction } from '@/lib/types';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

async function getTodaysSummary() {
  const userId = await requireUserId();

  const rows = (await sql`
    select *
    from transactions
    where user_id = ${userId}
      and created_at::date = current_date
    order by created_at desc
  `) as Transaction[];

  const totalIn = rows
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalOut = rows
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const creditOut = rows
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net = totalIn - totalOut;

  return { rows, totalIn, totalOut, creditOut, net };
}

export default async function DashboardPage() {
  const { rows, totalIn, totalOut, creditOut, net } = await getTodaysSummary();

  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-baseline justify-between border-b border-ink/10 pb-3">
        <h1 className="font-serif text-lg font-semibold">Ndalama</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-gray-500">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
          <Link href="/history" className="font-mono text-[10px] text-gray-500 underline">
            History
          </Link>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <section className="py-5">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gray-500">Net today</p>
        <p className={`font-mono text-4xl font-semibold ${net >= 0 ? 'text-green-700' : 'text-rust'}`}>
          K {net.toFixed(2)}
        </p>
        <div className="mt-3 flex gap-6 font-mono text-xs">
          <div>
            <p className="text-[10px] uppercase text-gray-500">In</p>
            <p className="text-green-700">K {totalIn.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-500">Out</p>
            <p className="text-rust">K {totalOut.toFixed(2)}</p>
          </div>
          <Link href="/credit">
            <p className="text-[10px] uppercase text-gray-500">Credit out</p>
            <p className="text-amber-600 underline">K {creditOut.toFixed(2)}</p>
          </Link>
        </div>
      </section>

      <div className="mb-5 flex gap-2">
        <Link
          href="/add?type=sale"
          className="flex-1 rounded-lg bg-green-700 py-3 text-center text-xs font-semibold text-paper"
        >
          + Sale
        </Link>
        <Link
          href="/add?type=expense"
          className="flex-1 rounded-lg bg-rust py-3 text-center text-xs font-semibold text-paper"
        >
          + Expense
        </Link>
        <Link
          href="/add?type=credit"
          className="flex-1 rounded-lg bg-amber-600 py-3 text-center text-xs font-semibold text-ink"
        >
          + Credit
        </Link>
      </div>

      <section>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">Today</p>
        <ul>
          {rows.length === 0 && (
            <li className="py-4 text-sm text-gray-500">No entries yet today.</li>
          )}
          {rows.map((t) => (
            <li key={t.id} className="border-b border-dashed border-ink/10 py-2">
              <Link href={`/transactions/${t.id}/edit`} className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{t.counterparty_name ?? '—'}</p>
                  <p className="font-mono text-[10px] text-gray-500">
                    {t.type} · {t.channel.replace('_', ' ')}
                  </p>
                </div>
                <p
                  className={`font-mono text-sm font-semibold ${
                    t.type === 'sale' ? 'text-green-700' : t.type === 'expense' ? 'text-rust' : 'text-amber-600'
                  }`}
                >
                  {t.type === 'expense' ? '−' : '+'}K {Number(t.amount).toFixed(2)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
