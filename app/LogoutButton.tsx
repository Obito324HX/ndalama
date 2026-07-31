'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Log out"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 text-ink/50 transition-colors hover:bg-ink/15"
    >
      <LogOut size={16} strokeWidth={2} />
    </button>
  );
}
