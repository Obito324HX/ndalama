'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseMobileMoneySms } from '@/lib/parseSms';

function ShareHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const sharedText = params.get('text') || params.get('url') || '';

    if (!sharedText) {
      router.replace('/add');
      return;
    }

    const { amount, type, counterpartyName } = parseMobileMoneySms(sharedText);

    const query = new URLSearchParams();
    query.set('type', type);
    query.set('channel', 'mobile_money');
    if (amount !== null) query.set('amount', String(amount));
    if (counterpartyName) query.set('counterparty_name', counterpartyName);

    router.replace(`/add?${query.toString()}`);
  }, [params, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-paper px-5 font-sans text-ink">
      <p className="font-mono text-sm text-gray-500">Reading message…</p>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <ShareHandler />
    </Suspense>
  );
}
