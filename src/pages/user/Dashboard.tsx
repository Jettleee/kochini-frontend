// FIT-033 user dashboard: calories, weight, next workout, progress
import clsx from "clsx";
import { Check, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { Barbell } from "../../components/Barbell";
import { Avatar, Button, Panel } from "../../components/ui";
import { fmtDay, round, scaleFood, weekOf, weekday } from "../../lib/format";
import { exerciseById, foodById, goals, mealLog, messages, TODAY, weightLog, workouts } from "../../lib/mock";

export function totals() {
  return mealLog.reduce(
    (t, m) => { const s = scaleFood(foodById(m.foodId), m.qty); return { kcal: t.kcal + s.kcal, protein: t.protein + s.protein, carbs: t.carbs + s.carbs, fat: t.fat + s.fat }; },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function Dashboard() {
  const t = totals();
  const next = workouts.find((w) => w.status === "planned" && w.date >= TODAY)!;
  const week = weekOf(TODAY);
  const latest = weightLog[weightLog.length - 1];
  const monthAgo = weightLog[weightLog.length - 6];
  const coachMsg = messages.filter((m) => !m.mine).at(-1)!;
  const macros = [
    { key: "protein", label: "Protein", value: t.protein, goal: goals.protein, color: "var(--plate-red)" },
    { key: "carbs", label: "Carbs", value: t.carbs, goal: goals.carbs, color: "var(--plate-yellow)" },
    { key: "fat", label: "Fat", value: t.fat, goal: goals.fat, color: "var(--plate-green)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-steel">{fmtDay(TODAY)}</p>
        <h1 className="mt-0.5">Good morning, Sara</h1>
      </div>

      {/* Hero: today's intake as a loaded bar */}
      <section className="panel overflow-hidden" aria-labelledby="load-h">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-5">
          <div>
            <h2 id="load-h" className="text-lg">Today's load</h2>
            <p className="mt-1">
              <span className="num text-[3.5rem] leading-none">{Math.round(t.kcal)}</span>
              <span className="ml-2 text-steel">of {goals.kcal} kcal</span>
            </p>
            <p className="text-sm text-steel">{Math.max(0, goals.kcal - Math.round(t.kcal))} kcal left for dinner and snacks</p>
          </div>
          <Link to="/app/nutrition"><Button variant="secondary">Log food</Button></Link>
        </div>
        <div className="px-2 pt-2 sm:px-6"><Barbell loads={macros} /></div>
        <dl className="grid grid-cols-3 border-t border-line">
          {macros.map((m) => (
            <div key={m.key} className="border-r border-line px-3 py-3 last:border-r-0 sm:px-5">
              <dt className="flex items-center gap-2 text-sm text-steel"><span className="h-3 w-1.5 rounded-sm" style={{ background: m.color }} />{m.label}</dt>
              <dd className="mt-0.5 whitespace-nowrap"><span className="num text-2xl">{Math.round(m.value)}</span><span className="text-sm text-steel"> / {m.goal} g</span></dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel title="Next workout" action={next.assignedBy && <span className="text-sm text-steel">From {next.assignedBy}</span>}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-bold">{next.name}</p>
              <p className="text-steel">{next.date === TODAY ? "Today" : fmtDay(next.date)} · {next.exercises.length} exercises · about 55 min</p>
            </div>
            <Link to={`/app/workouts/${next.id}/session`}><Button><Play size={16} /> Start workout</Button></Link>
          </div>
          <ol className="mt-4 divide-y divide-line border-t border-line">
            {next.exercises.map((we, i) => {
              const ex = exerciseById(we.exerciseId)!;
              const top = we.sets[we.sets.length - 1];
              return (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="flex items-center gap-3"><span className="num w-5 text-steel">{i + 1}</span>{ex.name}</span>
                  <span className="text-sm text-steel tabular-nums">{we.sets.length} × {top.reps}{top.weight ? ` @ ${top.weight} kg` : " s"}</span>
                </li>
              );
            })}
          </ol>
        </Panel>

        <div className="space-y-6">
          <Panel title="This week">
            <ol className="grid grid-cols-7 gap-1 text-center">
              {week.map((d) => {
                const w = workouts.find((x) => x.date === d);
                const isToday = d === TODAY;
                return (
                  <li key={d} className="flex flex-col items-center gap-1.5">
                    <span className={clsx("text-xs", isToday ? "font-semibold text-ink" : "text-steel")}>{weekday(d)}</span>
                    <span
                      title={w ? `${w.name} (${w.status})` : "Rest day"}
                      className={clsx(
                        "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold",
                        w?.status === "done" && "border-fat bg-fat text-white",
                        w?.status === "planned" && "border-brand text-brand",
                        w?.status === "skipped" && "border-dashed border-steel text-steel",
                        !w && "border-transparent bg-black/[0.04]",
                        isToday && "ring-2 ring-iron ring-offset-2",
                      )}
                    >
                      {w?.status === "done" ? <Check size={16} /> : w ? w.name.split(" ")[1] : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-sm text-steel">1 of 4 sessions done. Upper A is today.</p>
          </Panel>

          <Panel title="Weight" action={<Link to="/app/progress" className="link text-sm">See progress</Link>}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p><span className="num text-[2rem] leading-none">{latest.kg}</span><span className="ml-1 text-steel">kg</span></p>
                <p className="text-sm text-fat font-semibold">{round(latest.kg - monthAgo.kg, 1)} kg in 30 days</p>
                <p className="text-sm text-steel">Goal {goals.weightKg} kg</p>
              </div>
              <div className="h-16 w-36">
                <ResponsiveContainer>
                  <LineChart data={weightLog.slice(-8)}>
                    <YAxis hide domain={["dataMin - 0.3", "dataMax + 0.3"]} />
                    <Line dataKey="kg" stroke="var(--iron)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="From your coach" action={<Link to="/app/messages" className="link text-sm">Reply</Link>}>
        <div className="flex gap-3">
          <Avatar name={coachMsg.from} />
          <div>
            <p className="font-semibold">{coachMsg.from} <span className="font-normal text-sm text-steel">· {coachMsg.at}</span></p>
            <p className="mt-0.5 max-w-prose">{coachMsg.body}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
