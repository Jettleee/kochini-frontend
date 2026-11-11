// The KOCHINI signature: today's nutrition drawn as plates loaded on a barbell.
// Each macro is a plate in its bumper-plate colour; plate height = % of the daily goal.
// Same plates appear on both sleeves, like a real loaded bar.
import { round } from "../lib/format";

interface Load { key: string; label: string; value: number; goal: number; color: string }

export function Barbell({ loads, compact }: { loads: Load[]; compact?: boolean }) {
  // Wide bar on tablet/desktop, shorter bar on phones so the plates stay large.
  return (
    <>
      <div className="hidden sm:block"><Bar loads={loads} compact={compact} width={640} collar={150} /></div>
      <div className="sm:hidden"><Bar loads={loads} compact={compact} width={360} collar={100} /></div>
    </>
  );
}

function Bar({ loads, compact, width, collar }: { loads: Load[]; compact?: boolean; width: number; collar: number }) {
  const H = compact ? 96 : 150;
  const plateW = compact ? 14 : 22;
  const gap = 3;
  const cy = H / 2;
  const leftCollar = collar;
  const rightCollar = width - collar;
  const minH = H * 0.22;

  const plates = loads.map((l) => {
    const pct = Math.min(1, l.value / l.goal);
    return { ...l, pct, h: minH + (H - 8 - minH) * pct };
  });

  const summary = loads.map((l) => `${l.label} ${round(l.value)} of ${l.goal}`).join(", ");

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${width} ${H}`} className="w-full" role="img" aria-label={`Today's intake: ${summary}`}>
        {/* bar */}
        <rect x={8} y={cy - 3} width={width - 16} height={6} rx={3} fill="#8a929b" />
        <rect x={leftCollar - 6} y={cy - 9} width={6} height={18} rx={1} fill="var(--iron)" />
        <rect x={rightCollar} y={cy - 9} width={6} height={18} rx={1} fill="var(--iron)" />
        {/* grip knurl */}
        {Array.from({ length: Math.floor((rightCollar - leftCollar - 80) / 9) }, (_, i) => (
          <line key={i} x1={leftCollar + 40 + i * 9} x2={leftCollar + 44 + i * 9} y1={cy - 3} y2={cy + 3} stroke="#6f7780" strokeWidth={1} />
        ))}
        {plates.map((p, i) => {
          const lx = leftCollar - 6 - (i + 1) * (plateW + gap);
          const rx = rightCollar + 6 + gap + i * (plateW + gap);
          return (
            <g key={p.key} className="plate-in" style={{ animationDelay: `${i * 110}ms` }}>
              <rect x={lx} y={cy - p.h / 2} width={plateW} height={p.h} rx={3} fill={p.color} />
              <rect x={rx} y={cy - p.h / 2} width={plateW} height={p.h} rx={3} fill={p.color} />
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
