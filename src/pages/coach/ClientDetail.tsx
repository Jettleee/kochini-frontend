// FIT-078 client progress (only what the client shares), FIT-080 coach feedback, FIT-079 program, FIT-087 plan edits
import { ArrowLeft, EyeOff, MessageSquare, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Avatar, Badge, Button, Empty, Meter, Panel, Tabs } from "../../components/ui";
import { fmtDay, fmtShort } from "../../lib/format";
import { clients, exerciseById, goals, workouts, weightLog } from "../../lib/mock";

type Tab = "overview" | "program" | "nutrition";

function Hidden({ what }: { what: string }) {
  return <div className="flex items-center gap-3 rounded-panel border border-dashed border-line p-5 text-steel"><EyeOff size={18} /> This client hasn't shared their {what} with you.</div>;
}

export function ClientDetail() {
  const { id } = useParams();
  const c = clients.find((x) => x.id === id);
  const [tab, setTab] = useState<Tab>("overview");
  const [notes, setNotes] = useState<Record<string, string[]>>({ w1: ["Good depth on squats. Keep the same weight next week."] });
  const [draft, setDraft] = useState<Record<string, string>>({});
  if (!c) return <Empty title="Client not found" body="They may have ended coaching." action={<Link to="/coach" className="link">Back to clients</Link>} />;
  const done = workouts.filter((w) => w.status !== "planned").sort((a, b) => b.date.localeCompare(a.date));
  const planned = workouts.filter((w) => w.status === "planned");

  return (
    <div className="space-y-6">
      <Link to="/coach" className="inline-flex items-center gap-1 text-sm text-steel hover:text-ink"><ArrowLeft size={16} /> Clients</Link>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={c.name} size={56} />
        <div className="flex-1">
          <h1>{c.name}</h1>
          <p className="text-steel">{c.goal}. {c.program}. {c.plan === "premium" ? "Premium" : "Free plan"}.</p>
        </div>
        <Link to="/coach/messages"><Button variant="secondary"><MessageSquare size={16} /> Message</Button></Link>
      </div>

      <Tabs label="Client sections" value={tab} onChange={setTab} items={[{ value: "overview", label: "Overview" }, { value: "program", label: "Program" }, { value: "nutrition", label: "Nutrition" }]} />

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            <Panel title="Recent sessions">
              {!c.sharing.workouts ? <Hidden what="workouts" /> : (
                <ul className="space-y-4">
                  {done.map((w) => (
                    <li key={w.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{w.name} <span className="font-normal text-steel">{fmtDay(w.date)}</span></p>
                        {w.status === "done" ? <Badge tone="green">{w.durationMin} min</Badge> : <Badge tone="red">Skipped</Badge>}
                      </div>
                      {w.exercises.length > 0 && <p className="mt-1 text-sm text-steel">{w.exercises.map((e) => `${exerciseById(e.exerciseId)?.name} ${e.sets.map((s) => s.weight ? `${s.weight}×${s.reps}` : s.reps).join(", ")}`).join(". ")}</p>}
                      {(notes[w.id] ?? []).map((n, i) => <p key={i} className="mt-2 rounded-[4px] border-l-4 border-brand bg-brand-soft/50 px-3 py-1.5 text-sm">{n}</p>)}
                      {w.status === "done" && (
                        <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = draft[w.id]?.trim(); if (!t) return; setNotes({ ...notes, [w.id]: [...(notes[w.id] ?? []), t] }); setDraft({ ...draft, [w.id]: "" }); }}>
                          <label htmlFor={`fb-${w.id}`} className="sr-only">Feedback on {w.name}</label>
                          <input id={`fb-${w.id}`} className="input h-9 flex-1 text-sm" placeholder="Leave feedback on this session" value={draft[w.id] ?? ""} onChange={(e) => setDraft({ ...draft, [w.id]: e.target.value })} />
                          <Button size="sm" type="submit" variant="secondary">Post</Button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
          <div className="space-y-6">
            <Panel title="Adherence"><p className="num text-4xl">{c.adherence}%</p><div className="mt-2"><Meter value={c.adherence} max={100} label="Adherence" /></div><p className="mt-2 text-sm text-steel">Planned sessions completed in the last 14 days.</p></Panel>
            <Panel title="Weight">
              {!c.sharing.weight ? <Hidden what="weight" /> : (
                <div className="h-44">
                  <ResponsiveContainer>
                    <LineChart data={weightLog.map((w) => ({ ...w, l: fmtShort(w.date) }))} margin={{ left: -20, right: 8 }}>
                      <XAxis dataKey="l" tick={{ fontSize: 11, fill: "var(--steel)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis domain={["dataMin - 1", "dataMax + 0.5"]} tick={{ fontSize: 11, fill: "var(--steel)" }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(v: number) => [`${v} kg`, "Weight"]} />
                      <Line dataKey="kg" stroke="var(--iron)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}

      {tab === "program" && (
        <Panel title={c.program} action={<Link to="/coach/programs/new"><Button size="sm"><Plus size={14} /> Add workout</Button></Link>}>
          <p className="mb-4 text-sm text-steel">Week 3 of 8. Changes are versioned and the client is notified.</p>
          <ul className="divide-y divide-line">
            {planned.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div><p className="font-semibold">{w.name}</p><p className="text-sm text-steel">{fmtDay(w.date)}. {w.exercises.map((e) => exerciseById(e.exerciseId)?.name).join(", ")}</p></div>
                <Link to={`/coach/programs/${w.id}/edit`}><Button size="sm" variant="secondary"><Pencil size={14} /> Edit</Button></Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {tab === "nutrition" && (
        <Panel title="Nutrition targets">
          {!c.sharing.nutrition ? <Hidden what="food diary" /> : (
            <div className="grid gap-4 sm:grid-cols-4">
              {[["Calories", goals.kcal, "kcal", 1528], ["Protein", goals.protein, "g", 104], ["Carbs", goals.carbs, "g", 160], ["Fat", goals.fat, "g", 41]].map(([k, g, u, today]) => (
                <div key={k as string}><p className="text-sm text-steel">{k}</p><p className="num text-2xl">{today}<span className="font-sans text-sm font-normal text-steel"> / {g} {u}</span></p><p className="text-xs text-steel">Today</p></div>
              ))}
              <div className="sm:col-span-4"><Button variant="secondary" size="sm"><Pencil size={14} /> Adjust targets</Button></div>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
