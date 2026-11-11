import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo";

export function AuthLayout({ title, sub, children, footer }: { title: string; sub?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-iron p-10 text-chalk lg:flex lg:flex-col">
        <Link to="/" aria-label="KOCHINI home"><Logo tone="light" size="lg" /></Link>
        <div className="mt-auto max-w-md">
          <p className="font-display text-[3.25rem] font-bold leading-[0.95]">Train with a plan and a coach who sees your progress.</p>
          <p className="mt-4 text-chalk/70">Plan sessions, log every set and meal, and share progress with a coach who can adjust your plan.</p>
        </div>
        {/* plate stack */}
        <svg className="absolute -right-10 top-24 opacity-90" width="220" height="320" viewBox="0 0 220 320" aria-hidden>
          <rect x="0" y="156" width="220" height="8" rx="4" fill="#8a929b" />
          <rect x="40" y="10" width="34" height="300" rx="5" fill="var(--plate-red)" />
          <rect x="80" y="30" width="30" height="260" rx="5" fill="var(--plate-blue)" />
          <rect x="116" y="60" width="26" height="200" rx="5" fill="var(--plate-yellow)" />
          <rect x="148" y="90" width="22" height="140" rx="5" fill="var(--plate-green)" />
        </svg>
      </aside>
      <main className="flex min-h-screen flex-col px-4 py-8 sm:px-8">
        <Link to="/" aria-label="KOCHINI home" className="lg:hidden"><Logo /></Link>
        <div className="m-auto w-full max-w-sm py-10">
          <h1>{title}</h1>
          {sub && <p className="mt-2 text-steel">{sub}</p>}
          <div className="mt-8">{children}</div>
        </div>
        {footer && <div className="text-center text-sm text-steel">{footer}</div>}
      </main>
    </div>
  );
}

export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] border border-line bg-surface font-semibold hover:border-steel">
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
      {label}
    </button>
  );
}
