// FIT-043 workout builder (order, sets, reps, rest), FIT-050 swap for an alternative.
// Also reused by coaches to build client programs (FIT-079).
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Repeat, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Field, Input, Modal, PageHeader, Select } from "../../components/ui";
import { exerciseById, exercises, TODAY, workouts } from "../../lib/mock";
import type { WorkoutExercise } from "../../lib/types";

export function WorkoutBuilder({ backTo = "/app/workouts", forClient }: { backTo?: string; forClient?: string }) {
  const { id } = useParams();
  const existing = workouts.find((w) => w.id === id);
  const nav = useNavigate();
  const [name, setName] = useState(existing?.name ?? "");
  const [date, setDate] = useState(existing?.date ?? TODAY);
  const [items, setItems] = useState<WorkoutExercise[]>(existing?.exercises ?? []);
  const [picker, setPicker] = useState<{ mode: "add" } | { mode: "swap"; index: number } | null>(null);
  const [q, setQ] = useState("");
  const [nameError, setNameError] = useState<string>();

  const move = (i: number, d: -1 | 1) => setItems((xs) => { const a = [...xs]; [a[i], a[i + d]] = [a[i + d], a[i]]; return a; });
  const patch = (i: number, p: Partial<WorkoutExercise>) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const pick = (exerciseId: string) => {
    if (picker?.mode === "swap") patch(picker.index, { exerciseId });
    else setItems((xs) => [...xs, { exerciseId, restSec: 90, sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] }]);
    setPicker(null); setQ("");
  };
  const swapPool = picker?.mode === "swap" ? exerciseById(items[picker.index].exerciseId)?.alternatives ?? [] : null;
  const pool = exercises.filter((e) => e.status === "published" && (!swapPool || swapPool.includes(e.id)) && e.name.toLowerCase().includes(q.toLowerCase()));

  function save() {
    if (!name.trim()) { setNameError("Give the workout a name, like “Upper A”."); return; }
    nav(backTo); // POST/PUT /api/workouts
  }

  return (
    <div className="max-w-3xl">
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-steel hover:text-ink"><ArrowLeft size={16} /> Back</Link>
      <PageHeader title={existing ? `Edit ${existing.name}` : forClient ? `New workout for ${forClient}` : "New workout"}
        actions={<><Link to={backTo}><Button variant="ghost">Cancel</Button></Link><Button onClick={save} disabled={items.length === 0}>Save workout</Button></>} />

      <div className="panel grid gap-4 p-4 sm:grid-cols-[2fr_1fr]">
        <Field label="Name" error={nameError}>{(fid, d) => <Input id={fid} aria-invalid={!!nameError} aria-describedby={d} value={name} onChange={(e) => { setName(e.target.value); setNameError(undefined); }} placeholder="Upper A" />}</Field>
        <Field label="Date">{(fid) => <Input id={fid} type="date" value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 && <Empty title="No exercises yet" body="Add the exercises in the order you'll do them. You can reorder them later." action={<Button onClick={() => setPicker({ mode: "add" })}><Plus size={16} /> Add exercise</Button>} />}
        {items.map((it, i) => {
          const ex = exerciseById(it.exerciseId)!;
          return (
            <section key={i} className="panel" aria-label={ex.name}>
              <header className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="num w-6 text-steel">{i + 1}</span>
                <h3 className="flex-1">{ex.name}</h3>
                <Button size="sm" variant="ghost" onClick={() => setPicker({ mode: "swap", index: i })} disabled={!ex.alternatives.length}><Repeat size={14} /> Swap</Button>
                <button className="rounded p-1.5 hover:bg-black/5 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp size={16} /></button>
                <button className="rounded p-1.5 hover:bg-black/5 disabled:opacity-30" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown size={16} /></button>
                <button className="rounded p-1.5 text-danger hover:bg-danger/5" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label={`Remove ${ex.name}`}><Trash2 size={16} /></button>
              </header>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-steel"><th className="w-12 pb-1 font-semibold">Set</th><th className="pb-1 font-semibold">Reps</th><th className="pb-1 font-semibold">Weight (kg)</th><th className="w-8" /></tr></thead>
                  <tbody>
                    {it.sets.map((s, si) => (
                      <tr key={si}>
                        <td className="num py-1 text-base">{si + 1}</td>
                        <td className="py-1 pr-2"><Input aria-label={`Set ${si + 1} reps`} type="number" min={1} className="h-9 max-w-[96px]" value={s.reps} onChange={(e) => patch(i, { sets: it.sets.map((x, k) => k === si ? { ...x, reps: +e.target.value } : x) })} /></td>
                        <td className="py-1 pr-2"><Input aria-label={`Set ${si + 1} weight`} type="number" min={0} step={2.5} className="h-9 max-w-[110px]" value={s.weight} onChange={(e) => patch(i, { sets: it.sets.map((x, k) => k === si ? { ...x, weight: +e.target.value } : x) })} /></td>
                        <td><button className="rounded p-1 text-steel hover:text-danger disabled:opacity-30" disabled={it.sets.length === 1} onClick={() => patch(i, { sets: it.sets.filter((_, k) => k !== si) })} aria-label={`Remove set ${si + 1}`}><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <Button size="sm" variant="secondary" onClick={() => patch(i, { sets: [...it.sets, { ...it.sets[it.sets.length - 1] }] })}><Plus size={14} /> Add set</Button>
                  <label className="flex items-center gap-2 text-sm">Rest
                    <Select className="h-9 w-auto" value={it.restSec} onChange={(e) => patch(i, { restSec: +e.target.value })}>
                      {[30, 60, 90, 120, 150, 180].map((s) => <option key={s} value={s}>{s >= 60 ? `${s / 60} min${s % 60 ? " 30 s" : ""}` : `${s} s`}</option>)}
                    </Select>
                  </label>
                </div>
              </div>
            </section>
          );
        })}
        {items.length > 0 && <Button variant="secondary" className="w-full" onClick={() => setPicker({ mode: "add" })}><Plus size={16} /> Add exercise</Button>}
      </div>

      <Modal open={!!picker} onClose={() => setPicker(null)} title={picker?.mode === "swap" ? "Swap for an alternative" : "Add exercise"}>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <Input autoFocus aria-label="Search exercises" placeholder="Search" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <ul className="mt-3 max-h-80 divide-y divide-line overflow-y-auto">
          {pool.map((e) => (
            <li key={e.id}><button className="flex w-full items-center justify-between gap-3 px-1 py-2.5 text-left hover:bg-black/[0.03]" onClick={() => pick(e.id)}>
              <span><span className="block font-semibold">{e.name}</span><span className="text-sm text-steel">{e.primary}, {e.equipment.toLowerCase()}</span></span>
              <Plus size={16} className="text-brand" />
            </button></li>
          ))}
          {pool.length === 0 && <li className="py-4 text-steel">No exercises match “{q}”.</li>}
        </ul>
      </Modal>
    </div>
  );
}
