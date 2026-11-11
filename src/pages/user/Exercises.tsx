// FIT-035 catalogue & filters, FIT-038 muscle filter, FIT-039 favourites
import { Heart, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MuscleMap } from "../../components/MuscleMap";
import { Badge, Chip, Empty, Input, PageHeader, Select } from "../../components/ui";
import { exercises } from "../../lib/mock";
import type { Equipment, Muscle } from "../../lib/types";

const MUSCLES: Muscle[] = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "Core"];
const EQUIP: Equipment[] = ["Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Band"];

export function Exercises() {
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<Muscle | null>(null);
  const [equip, setEquip] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [favs, setFavs] = useState<string[]>(["e1", "e14"]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const list = useMemo(() => exercises.filter((e) =>
    e.status === "published" &&
    (!q || e.name.toLowerCase().includes(q.toLowerCase())) &&
    (!muscle || e.primary === muscle || e.secondary.includes(muscle)) &&
    (!equip || e.equipment === equip) &&
    (!level || e.difficulty === level) &&
    (!onlyFavs || favs.includes(e.id))), [q, muscle, equip, level, onlyFavs, favs]);

  const reset = () => { setQ(""); setMuscle(null); setEquip(""); setLevel(""); setOnlyFavs(false); };

  return (
    <div>
      <PageHeader title="Exercises" sub="Browse by muscle, equipment or difficulty. Save the ones you use often." />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5">
          <div className="panel p-4">
            <p className="mb-2 text-sm font-semibold">Pick a muscle</p>
            <MuscleMap selected={muscle} onSelect={(m) => setMuscle(m === muscle ? null : m)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLES.map((m) => <Chip key={m} active={muscle === m} onClick={() => setMuscle(muscle === m ? null : m)}>{m}</Chip>)}
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
              <Input aria-label="Search exercises" placeholder="Search exercises" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select aria-label="Equipment" value={equip} onChange={(e) => setEquip(e.target.value)} className="w-auto">
              <option value="">Any equipment</option>{EQUIP.map((e) => <option key={e}>{e}</option>)}
            </Select>
            <Select aria-label="Difficulty" value={level} onChange={(e) => setLevel(e.target.value)} className="w-auto">
              <option value="">Any level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </Select>
            <Chip active={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>Saved</Chip>
          </div>
          <p className="mt-3 text-sm text-steel" aria-live="polite">{list.length} exercise{list.length === 1 ? "" : "s"}{muscle ? ` for ${muscle.toLowerCase()}` : ""}</p>

          {list.length === 0 ? (
            <div className="mt-4"><Empty title="No exercises match these filters" body="Try another muscle or equipment type, or clear the filters to see everything." action={<button className="link" onClick={reset}>Clear filters</button>} /></div>
          ) : (
            <ul className="mt-3 divide-y divide-line panel">
              {list.map((e) => (
                <li key={e.id} className="flex items-center gap-4 px-4 py-3">
                  <Link to={`/app/exercises/${e.id}`} className="min-w-0 flex-1 group">
                    <p className="font-semibold group-hover:text-brand">{e.name}</p>
                    <p className="text-sm text-steel">{e.primary}{e.secondary.length ? `, ${e.secondary.join(", ").toLowerCase()}` : ""}</p>
                  </Link>
                  <span className="hidden text-sm text-steel sm:block w-24">{e.equipment}</span>
                  <span className="hidden md:block w-28"><Badge tone={e.difficulty === "Beginner" ? "green" : e.difficulty === "Intermediate" ? "yellow" : "red"}>{e.difficulty}</Badge></span>
                  <button
                    onClick={() => setFavs((f) => f.includes(e.id) ? f.filter((x) => x !== e.id) : [...f, e.id])}
                    aria-pressed={favs.includes(e.id)}
                    aria-label={favs.includes(e.id) ? `Remove ${e.name} from saved` : `Save ${e.name}`}
                    className="rounded p-1.5 hover:bg-black/5"
                  >
                    <Heart size={18} className={favs.includes(e.id) ? "fill-protein text-protein" : "text-steel"} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
