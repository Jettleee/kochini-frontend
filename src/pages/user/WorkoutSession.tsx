// FIT-045 log a live session (sets, reps, weight, optional RPE), FIT-046 rest timer & progress
import clsx from "clsx";
import { Check, ChevronLeft, ChevronRight, Pause, Play, Timer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Meter } from "../../components/ui";
import { exerciseById, workouts } from "../../lib/mock";
import type { WorkoutExercise } from "../../lib/types";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function WorkoutSession() {
  const { id } = useParams();
  const nav = useNavigate();
  const w = workouts.find((x) => x.id === id);
  const [plan, setPlan] = useState<WorkoutExercise[]>(() => structuredClone(w?.exercises ?? []));
  const [cur, setCur] = useState(0);
  const [rest, setRest] = useState<{ left: number; total: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (paused || done) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      setRest((r) => (r ? (r.left <= 1 ? null : { ...r, left: r.left - 1 }) : r));
    }, 1000);
    return () => clearInterval(t);
  }, [paused, done]);

  const totalSets = plan.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = plan.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
  const volume = useMemo(() => plan.reduce((v, e) => v + e.sets.filter((s) => s.done).reduce((a, s) => a + s.reps * s.weight, 0), 0), [plan]);

  if (!w) return <Empty title="Workout not found" body="Pick a planned workout from your week to start it." action={<Link to="/app/workouts" className="link">Go to workouts</Link>} />;

  const ex = plan[cur];
  const info = exerciseById(ex.exerciseId)!;
  const setField = (si: number, k: "reps" | "weight" | "rpe", v: number) =>
    setPlan((p) => p.map((e, i) => i !== cur ? e : { ...e, sets: e.sets.map((s, j) => j === si ? { ...s, [k]: v } : s) }));
  const complete = (si: number) => {
    const wasDone = ex.sets[si].done;
    setPlan((p) => p.map((e, i) => i !== cur ? e : { ...e, sets: e.sets.map((s, j) => j === si ? { ...s, done: !s.done } : s) }));
    if (!wasDone) setRest({ left: ex.restSec, total: ex.restSec });
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fat text-white"><Check size={28} /></span>
        <h1 className="mt-4">Workout saved</h1>
        <p className="mt-1 text-steel">{w.name} is in your history. Your coach can see it.</p>
        <dl className="mt-8 grid grid-cols-3 gap-2">
          {[["Time", mmss(elapsed)], ["Sets", `${doneSets}/${totalSets}`], ["Volume", `${volume.toLocaleString()} kg`]].map(([k, v]) => (
            <div key={k} className="panel p-3"><dt className="text-sm text-steel">{k}</dt><dd className="num text-2xl">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-6 rounded-panel bg-brand-soft px-4 py-3 text-sm text-brand">New best on Bench press: 42.5 kg × 5</p>
        <div className="mt-8 flex justify-center gap-2">
          <Link to="/app/workouts"><Button variant="secondary">See history</Button></Link>
          <Link to="/app"><Button>Back to today</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => nav("/app/workouts")} className="inline-flex items-center gap-1 text-sm text-steel hover:text-ink"><X size={16} /> Leave</button>
        <p className="num text-xl" aria-label={`Elapsed ${mmss(elapsed)}`}>{mmss(elapsed)}</p>
        <Button size="sm" variant="secondary" onClick={() => setPaused(!paused)}>{paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}</Button>
      </div>
      <div className="mt-4">
        <Meter value={doneSets} max={totalSets} label="Sets completed" />
        <p className="mt-1 text-sm text-steel">{doneSets} of {totalSets} sets</p>
      </div>

      <section className="panel mt-6" aria-live="polite">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm text-steel">Exercise {cur + 1} of {plan.length}</p>
          <h1 className="mt-0.5">{info.name}</h1>
          {ex.note && <p className="mt-1 text-sm">{ex.note}</p>}
          <p className="mt-1 text-sm text-steel">Rest {ex.restSec} s between sets. <Link to={`/app/exercises/${info.id}`} className="link">How to do it</Link></p>
        </div>
        <div className="divide-y divide-line">
          <div className="grid grid-cols-[32px_1fr_1fr_1fr_48px] gap-2 px-3 sm:px-5 py-2 text-sm font-semibold text-steel">
            <span>Set</span><span>kg</span><span>Reps</span><span>RPE</span><span className="sr-only">Done</span>
          </div>
          {ex.sets.map((s, si) => (
            <div key={si} className={clsx("grid grid-cols-[40px_1fr_1fr_1fr_56px] items-center gap-2 px-5 py-2.5", s.done && "bg-fat/[0.06]")}>
              <span className="num text-xl">{si + 1}</span>
              <input aria-label={`Set ${si + 1} weight`} inputMode="decimal" className="input num h-11 px-2 text-lg" value={s.weight} onChange={(e) => setField(si, "weight", +e.target.value || 0)} />
              <input aria-label={`Set ${si + 1} reps`} inputMode="numeric" className="input num h-11 px-2 text-lg" value={s.reps} onChange={(e) => setField(si, "reps", +e.target.value || 0)} />
              <input aria-label={`Set ${si + 1} RPE, optional`} inputMode="numeric" placeholder="–" className="input num h-11 px-2 text-lg" value={s.rpe ?? ""} onChange={(e) => setField(si, "rpe", +e.target.value || 0)} />
              <button onClick={() => complete(si)} aria-pressed={!!s.done} aria-label={s.done ? `Undo set ${si + 1}` : `Complete set ${si + 1}`}
                className={clsx("flex h-11 w-11 items-center justify-center rounded-full border-2", s.done ? "border-fat bg-fat text-white" : "border-line text-steel hover:border-fat hover:text-fat")}>
                <Check size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-3">
          <Button variant="ghost" disabled={cur === 0} onClick={() => setCur(cur - 1)}><ChevronLeft size={16} /> Previous</Button>
          {cur < plan.length - 1
            ? <Button onClick={() => setCur(cur + 1)}>Next exercise <ChevronRight size={16} /></Button>
            : <Button onClick={() => setDone(true)}>Finish workout</Button>}
        </div>
      </section>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Exercises in this workout">
        {plan.map((e, i) => {
          const complete = e.sets.every((s) => s.done);
          return (
            <li key={i}><button onClick={() => setCur(i)} aria-current={i === cur ? "step" : undefined}
              className={clsx("rounded-full border px-3 py-1 text-sm", i === cur ? "border-iron bg-iron text-chalk" : complete ? "border-fat text-fat" : "border-line bg-surface")}>
              {exerciseById(e.exerciseId)?.name}
            </button></li>
          );
        })}
      </ol>

      {rest && (
        <div role="timer" aria-label="Rest timer" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-iron text-chalk lg:left-[232px]">
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4">
            <Timer size={22} className="shrink-0 text-chalk/70" />
            <div className="flex-1">
              <p className="text-sm text-chalk/70">Rest</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-carbs" style={{ width: `${(rest.left / rest.total) * 100}%` }} /></div>
            </div>
            <p className="num w-16 text-right text-3xl">{mmss(rest.left)}</p>
            <button className="rounded px-2 py-1 text-sm font-semibold hover:bg-white/10" onClick={() => setRest({ left: rest.left + 30, total: rest.total + 30 })}>+30 s</button>
            <button className="rounded px-2 py-1 text-sm font-semibold hover:bg-white/10" onClick={() => setRest(null)}>Skip</button>
          </div>
        </div>
      )}
    </div>
  );
}
