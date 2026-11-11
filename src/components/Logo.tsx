// KOCHINI logo.
// The mark is a "K": its stem is a blue bumper plate seen edge-on, and the two arms
// are the bar loading onto it. The colors follow the plate palette in index.css.
import clsx from "clsx";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      {/* plate (stem of the K) */}
      <rect x="4" y="2" width="9" height="28" rx="2.5" fill="var(--plate-blue)" />
      <rect x="7.5" y="13.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.35" />
      {/* arms of the K */}
      <path d="M15.5 16 L26.5 4.5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M15.5 16 L26.5 27.5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* collar where the arms meet the plate */}
      <circle cx="15.5" cy="16" r="2.6" fill="var(--plate-red)" />
    </svg>
  );
}

/** `tone="light"` for dark backgrounds (sidebar, auth panel), `tone="dark"` for light ones. */
export function Logo({ tone = "dark", size = "md", className }: { tone?: "light" | "dark"; size?: "sm" | "md" | "lg"; className?: string }) {
  const mark = size === "lg" ? 34 : size === "sm" ? 22 : 28;
  return (
    <span className={clsx("inline-flex items-center gap-2", tone === "light" ? "text-chalk" : "text-ink", className)} aria-label="KOCHINI">
      <LogoMark size={mark} />
      <span
        aria-hidden
        className={clsx("font-display font-bold leading-none tracking-[0.08em]", size === "lg" ? "text-[1.9rem]" : size === "sm" ? "text-xl" : "text-2xl")}
      >
        KOCHINI
      </span>
    </span>
  );
}
