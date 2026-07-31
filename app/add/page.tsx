'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TransactionType, TransactionChannel, CATEGORY_OPTIONS } from '@/lib/types';

const TYPES: TransactionType[] = ['sale', 'expense', 'credit'];
const CHANNELS: TransactionChannel[] = ['mobile_money', 'cash', 'bank'];

function AddTransactionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialType = (params.get('type') as TransactionType) ?? 'sale';

  const [type, setType] = useState<TransactionType>(
    TYPES.includes(initialType) ? initialType : 'sale'
  );
  const [channel, setChannel] = useState<TransactionChannel>('mobile_money');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(type === 'sale' ? 'sale' : 'other');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectType(t: TransactionType) {
    setType(t);
    setCategory(t === 'sale' ? 'sale' : 'other');
  }

  async function handleSave() {
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          channel,
          amount: parsedAmount,
          category,
          counterparty_name: counterpartyName || undefined,
          note: note || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save entry');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-baseline justify-between border-b border-ink/10 pb-3">
        <h1 className="font-serif text-lg font-semibold">New entry</h1>
        <button onClick={() => router.push('/dashboard')} className="font-mono text-[11px] text-gray-500">
          Cancel
        </button>
      </header>

      <div className="mt-5 flex rounded-lg bg-ink/5 p-1">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => selectType(t)}
            className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize ${
              type === t ? 'bg-ink text-paper' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-6 text-center">
        <p className="font-mono text-xs text-gray-500">ZMW</p>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="mt-1 w-full bg-transparent text-center font-mono text-4xl font-semibold outline-none placeholder:text-ink/20"
        />
      </div>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">Channel</p>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
                channel === c ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-ink'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">
          {type === 'expense' ? 'Paid to' : 'From'}
        </p>
        <input
          type="text"
          value={counterpartyName}
          onChange={(e) => setCounterpartyName(e.target.value)}
          placeholder="Name (optional)"
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
        />
      </div>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
                category === c ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-gray-500">Note</p>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional"
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
        />
      </div>

      {error && <p className="mb-3 text-sm text-rust">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-lg bg-ink py-3.5 text-sm font-semibold text-paper disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Log it'}
      </button>
    </main>
  );
}

export default function AddTransactionPage() {
  return (
    <Suspense fallback={null}>
      <AddTransactionForm />
    </Suspense>
  );
}
