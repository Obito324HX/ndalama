'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // localStorage unavailable — theme just won't persist, not fatal
    }
  }

  return (
    <button onClick={toggle} className="font-mono text-[10px] text-gray-500 underline">
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
