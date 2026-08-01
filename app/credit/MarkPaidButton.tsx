'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarkPaidButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function markPaid() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credit_status: 'paid' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update');
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={markPaid}
        disabled={loading}
        className="mt-1 rounded-full border border-green-700 px-2.5 py-1 font-mono text-[9.5px] text-green-700 disabled:opacity-50"
      >
        {loading ? '...' : 'Mark paid'}
      </button>
      {error && <p className="mt-1 font-mono text-[9px] text-rust">Failed, try again</p>}
    </>
  );
}
