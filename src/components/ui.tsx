// KOCHINI UI kit (FIT-005). Small, unopinionated primitives; pages compose them.
import clsx from "clsx";
import { X } from "lucide-react";
import {
  forwardRef, useEffect, useId, useRef,
  type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes,
} from "react";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" }>(
  ({ variant = "primary", size = "md", className, ...p }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-[15px]",
        variant === "primary" && "bg-brand text-white hover:bg-[#173f80]",
        variant === "secondary" && "bg-surface text-ink border border-line hover:border-steel",
        variant === "ghost" && "text-ink hover:bg-black/5",
        variant === "danger" && "bg-surface text-danger border border-danger/40 hover:bg-danger/5",
        className,
      )}
      {...p}
    />
  ),
);

export function Field({ label, hint, error, children, id }: { label: string; hint?: string; error?: string; children: (id: string, describedBy?: string) => ReactNode; id?: string }) {
  const auto = useId();
  const fid = id ?? auto;
  const desc = error ? `${fid}-err` : hint ? `${fid}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fid} className="block text-sm font-semibold text-ink">{label}</label>
      {children(fid, desc)}
      {error ? <p id={`${fid}-err`} className="text-sm text-danger">{error}</p>
        : hint ? <p id={`${fid}-hint`} className="text-sm text-steel">{hint}</p> : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={clsx("input", className)} {...p} />
));
export const Select = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={clsx("input pr-8", className)} {...p} />
);

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={clsx("panel", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-lg">{title}</h2>
          {action}
        </header>
      )}
      <div className={clsx("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1>{title}</h1>
        {sub && <p className="mt-1 text-steel max-w-prose">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const tones = {
  neutral: "bg-black/[0.06] text-ink",
  blue: "bg-brand-soft text-brand",
  green: "bg-fat/10 text-fat",
  yellow: "bg-carbs/15 text-[#7a5600]",
  red: "bg-protein/10 text-danger",
};
export function Badge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active ? "border-iron bg-iron text-chalk" : "border-line bg-surface text-ink hover:border-steel",
      )}
    >
      {children}
    </button>
  );
}

export function Meter({ value, max, color = "var(--plate-blue)", label }: { value: number; max: number; color?: string; label: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div role="meter" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={max} className="h-2 w-full overflow-hidden rounded-full bg-black/[0.07]">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center rounded-full bg-iron font-display font-semibold text-chalk" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials}
    </span>
  );
}

export function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: { value: T; label: string }[]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-line overflow-x-auto">
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={value === it.value}
          onClick={() => onChange(it.value)}
          className={clsx(
            "-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-[15px] font-semibold",
            value === it.value ? "border-brand text-ink" : "border-transparent text-steel hover:text-ink",
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-panel border border-dashed border-line px-5 py-8">
      <h3>{title}</h3>
      <p className="text-steel max-w-prose">{body}</p>
      {action}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <label htmlFor={id} className="font-semibold">{label}</label>
        {description && <p className="text-sm text-steel">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx("relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand" : "bg-black/20")}
      >
        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={clsx("m-auto w-[calc(100%-32px)] rounded-panel border border-line bg-surface p-0 text-ink backdrop:bg-iron/50", wide ? "max-w-2xl" : "max-w-md")}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2>{title}</h2>
        <button onClick={onClose} aria-label="Close" className="rounded p-1 text-steel hover:text-ink"><X size={20} /></button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}

export function Stat({ label, value, unit, note }: { label: string; value: ReactNode; unit?: string; note?: ReactNode }) {
  return (
    <div>
      <p className="text-sm text-steel">{label}</p>
      <p className="mt-0.5"><span className="num text-[2rem] leading-none">{value}</span>{unit && <span className="ml-1 text-steel">{unit}</span>}</p>
      {note && <p className="mt-1 text-sm text-steel">{note}</p>}
    </div>
  );
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[15px]">
        <thead>
          <tr className="border-b border-line text-sm text-steel">
            {head.map((h, i) => <th key={i} scope="col" className="px-4 py-2 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
