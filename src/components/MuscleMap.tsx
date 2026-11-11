// Simplified front/back body map used to filter exercises by muscle (FIT-038)
// and to show worked muscles on an exercise page (FIT-036).
import type { Muscle } from "../lib/types";

type Shape = { m: Muscle; d: string };
// Geometric, symmetrical regions on a 100×200 figure.
const FRONT: Shape[] = [
  { m: "Shoulders", d: "M28 44 q-8 2 -9 12 l9 2 l6 -12z M72 44 q8 2 9 12 l-9 2 l-6 -12z" },
  { m: "Chest", d: "M35 46 h14 v16 q-8 3 -16 -1 l-2 -9z M51 46 h14 l4 6 l-2 9 q-8 4 -16 1z" },
  { m: "Biceps", d: "M19 60 l9 1 l-1 18 l-8 -1z M81 60 l-9 1 l1 18 l8 -1z" },
  { m: "Core", d: "M37 66 h26 l-2 34 h-22z" },
  { m: "Quads", d: "M36 106 h13 l-2 44 h-10z M51 106 h13 l-1 44 h-10z" },
  { m: "Calves", d: "M38 156 h9 l-1 30 h-7z M53 156 h9 l-1 30 h-7z" },
];
const BACK: Shape[] = [
  { m: "Shoulders", d: "M28 44 q-8 2 -9 12 l9 2 l6 -12z M72 44 q8 2 9 12 l-9 2 l-6 -12z" },
  { m: "Back", d: "M35 46 h30 l3 10 l-6 26 h-24 l-6 -26z" },
  { m: "Triceps", d: "M19 60 l9 1 l-1 18 l-8 -1z M81 60 l-9 1 l1 18 l8 -1z" },
  { m: "Glutes", d: "M37 88 h26 l1 16 q-14 6 -28 0z" },
  { m: "Hamstrings", d: "M36 108 h13 l-2 42 h-10z M51 108 h13 l-1 42 h-10z" },
  { m: "Calves", d: "M38 156 h9 l-1 30 h-7z M53 156 h9 l-1 30 h-7z" },
];
const OUTLINE = "M42 8 a8 9 0 1 1 16 0 a8 9 0 1 1 -16 0 M44 24 h12 l2 16 l14 4 q12 4 12 20 l-2 22 h-6 l-3 -18 l-3 22 l1 4 l-1 50 l-1 36 h-12 l-1 -40 l-2 -40 l-2 40 l-1 40 h-12 l-1 -36 l-1 -50 l1 -4 l-3 -22 l-3 18 h-6 l-2 -22 q0 -16 12 -20 l14 -4z";

function Figure({ shapes, label, selected, highlight, secondary, onSelect }: {
  shapes: Shape[]; label: string; selected?: Muscle | null; highlight?: Muscle[]; secondary?: Muscle[]; onSelect?: (m: Muscle) => void;
}) {
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 100 200" className="h-48 w-auto" role={onSelect ? "group" : "img"} aria-label={`${label} view`}>
        <path d={OUTLINE} fill="#e6e8e3" stroke="#c5cac2" strokeWidth={1} />
        {shapes.map((s) => {
          const on = selected === s.m || highlight?.includes(s.m);
          const sec = secondary?.includes(s.m);
          const fill = on ? "var(--plate-blue)" : sec ? "#9db3d8" : "#b4bbb1";
          return onSelect ? (
            <path key={s.m} d={s.d} fill={fill} className="cursor-pointer outline-none hover:opacity-80 focus-visible:stroke-iron focus-visible:[stroke-width:2]"
              role="button" tabIndex={0} aria-pressed={selected === s.m} aria-label={s.m}
              onClick={() => onSelect(s.m)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(s.m))}>
              <title>{s.m}</title>
            </path>
          ) : <path key={s.m} d={s.d} fill={fill}><title>{s.m}</title></path>;
        })}
      </svg>
      <figcaption className="text-xs text-steel">{label}</figcaption>
    </figure>
  );
}

export function MuscleMap(p: { selected?: Muscle | null; highlight?: Muscle[]; secondary?: Muscle[]; onSelect?: (m: Muscle) => void }) {
  return (
    <div className="flex justify-center gap-2">
      <Figure shapes={FRONT} label="Front" {...p} />
      <Figure shapes={BACK} label="Back" {...p} />
    </div>
  );
}
