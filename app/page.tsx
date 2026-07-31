import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-md min-h-screen bg-paper text-ink px-5 py-6 font-sans">
      <header className="flex items-center justify-between pb-8">
        <h1 className="font-serif text-lg font-semibold">Ndalama</h1>
        <ThemeToggle />
      </header>

      <section className="py-6">
        <h2 className="font-serif text-3xl font-semibold leading-tight">
          Know exactly where your money went.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
          Log every mobile money sale, expense, and customer credit in seconds.
          See your daily net at a glance — no spreadsheets, no guesswork.
        </p>
      </section>

      <div className="my-8 space-y-4">
        <div className="flex gap-3 rounded-xl bg-ink/5 p-4">
          <span className="font-mono text-xs text-green-700">01</span>
          <div>
            <p className="text-sm font-semibold">Fast entry</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              Log a sale, expense, or credit in a few taps — built for the counter, not the back office.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl bg-ink/5 p-4">
          <span className="font-mono text-xs text-amber-600">02</span>
          <div>
            <p className="text-sm font-semibold">Never lose track of credit</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              See exactly who owes you what, and for how long — before it becomes a problem.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl bg-ink/5 p-4">
          <span className="font-mono text-xs text-rust">03</span>
          <div>
            <p className="text-sm font-semibold">Your real daily position</p>
            <p className="mt-0.5 text-[13px] text-gray-500">
              Mobile money, cash, and bank — all in one place, so you know your actual net, not just what moved.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href="/signup"
          className="block w-full rounded-lg bg-ink py-3.5 text-center text-sm font-semibold text-paper"
        >
          Get started free
        </Link>
        <Link
          href="/login"
          className="block w-full rounded-lg border border-ink/15 py-3.5 text-center text-sm font-semibold text-ink"
        >
          Log in
        </Link>
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-wide text-gray-400">
        Built for Zambian traders
      </p>
    </main>
  );
}
