'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction, TransactionChannel, CATEGORY_OPTIONS } from '@/lib/types';

const CHANNELS: TransactionChannel[] = ['mobile_money', 'cash', 'bank'];

export default function EditTransactionForm({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  const [amount, setAmount] = useState(transaction.amount);
  const [channel, setChannel] = useState<TransactionChannel>(transaction.channel);
  const [category, setCategory] = useState(transaction.category);
  const [counterpartyName, setCounterpartyName] = useState(transaction.counterparty_name ?? '');
  const [note, setNote] = useState(transaction.note ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          channel,
          category,
          counterparty_name: counterpartyName || undefined,
          note: note || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save');
      }
      router.push('/history');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/history');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-baseline justify-between border-b border-ink/10 pb-3">
        <h1 className="font-serif text-lg font-semibold capitalize">Edit {transaction.type}</h1>
        <button onClick={() => router.push('/history')} className="font-mono text-[11px] text-gray-500">
          Cancel
        </button>
      </header>

      <div className="py-6 text-center">
        <p className="font-mono text-xs text-gray-500">ZMW</p>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full bg-transparent text-center font-mono text-4xl font-semibold outline-none"
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
          {transaction.type === 'expense' ? 'Paid to' : 'From'}
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
        disabled={saving || deleting}
        className="w-full rounded-lg bg-ink py-3.5 text-sm font-semibold text-paper disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      <button
        onClick={handleDelete}
        disabled={saving || deleting}
        className="mt-3 w-full rounded-lg border border-rust py-3.5 text-sm font-semibold text-rust disabled:opacity-50"
      >
        {deleting ? 'Deleting…' : 'Delete entry'}
      </button>
    </main>
  );
}
