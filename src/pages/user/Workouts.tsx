// FIT-044 week planner, FIT-047 history, FIT-048 personal records, FIT-049 duplicate, FIT-175 templates
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Copy, Pencil, Play, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, PageHeader, Panel, Table, Tabs } from "../../components/ui";
import { addDays, fmtDay, fmtShort, parseDay, weekOf, weekday } from "../../lib/format";
import { exerciseById, personalRecords, templates, TODAY, workouts } from "../../lib/mock";

type Tab = "plan" | "history" | "records" | "templates";

export function Workouts() {
  const [tab, setTab] = useState<Tab>("plan");
  const [anchor, setAnchor] = useState(TODAY);
  const [toast, setToast] = useState<string | null>(null);
  const week = weekOf(anchor);
  const history = workouts.filter((w) => w.status !== "planned").sort((a, b) => b.date.localeCompare(a.date));

  const duplicate = (name: string) => { setToast(`Copied “${name}” to next week.`); setTimeout(() => setToast(null), 2500); };

  return (
    <div>
      <PageHeader title="Workouts" sub="Plan your week, run sessions and look back at what you lifted."
        actions={<Link to="/app/workouts/new"><Button><Plus size={16} /> New workout</Button></Link>} />
      <Tabs label="Workout views" value={tab} onChange={setTab} items={[
        { value: "plan", label: "Week plan" }, { value: "history", label: "History" },
        { value: "records", label: "Personal records" }, { value: "templates", label: "Programs" },
      ]} />

      <div className="mt-6">
        {tab === "plan" && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Button size="sm" variant="secondary" aria-label="Previous week" onClick={() => setAnchor(addDays(anchor, -7))}><ChevronLeft size={16} /></Button>
              <Button size="sm" variant="secondary" aria-label="Next week" onClick={() => setAnchor(addDays(anchor, 7))}><ChevronRight size={16} /></Button>
              <p className="font-semibold">{fmtShort(week[0])} – {fmtShort(week[6])}</p>
              {anchor !== TODAY && <button className="link text-sm" onClick={() => setAnchor(TODAY)}>This week</button>}
            </div>
            <ol className="grid gap-2 md:grid-cols-7">
              {week.map((d) => {
                const day = workouts.filter((w) => w.date === d);
                const isToday = d === TODAY;
                return (
                  <li key={d} className={clsx("panel flex min-h-[132px] flex-col p-3", isToday && "border-iron")}>
                    <p className={clsx("text-sm", isToday ? "font-semibold" : "text-steel")}>
                      {weekday(d)} <span className="num text-lg text-ink">{parseDay(d).getDate()}</span>{isToday && <span className="ml-1 text-xs">Today</span>}
                    </p>
                    <div className="mt-2 flex-1 space-y-2">
                      {day.map((w) => (
                        <div key={w.id} className={clsx("rounded-[4px] border-l-4 bg-chalk px-2 py-1.5",
                          w.status === "done" ? "border-fat" : w.status === "skipped" ? "border-steel opacity-70" : "border-brand")}>
                          <p className="text-sm font-semibold">{w.name}</p>
                          <p className="text-xs text-steel">{w.status === "done" ? `Done, ${w.durationMin} min` : w.status === "skipped" ? "Skipped" : `${w.exercises.length} exercises`}</p>
                          {w.status === "planned" && (
                            <div className="mt-1 flex gap-1">
                              <Link to={`/app/workouts/${w.id}/session`} aria-label={`Start ${w.name}`} className="rounded p-1 text-brand hover:bg-brand-soft"><Play size={14} /></Link>
                              <Link to={`/app/workouts/${w.id}/edit`} aria-label={`Edit ${w.name}`} className="rounded p-1 text-steel hover:bg-black/5"><Pencil size={14} /></Link>
                            </div>
                          )}
                        </div>
                      ))}
                      {day.length === 0 && <Link to="/app/workouts/new" className="block rounded-[4px] border border-dashed border-line py-2 text-center text-xs text-steel hover:border-steel hover:text-ink">Rest day. Add workout</Link>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {tab === "history" && (
          <ul className="space-y-3">
            {history.map((w) => (
              <li key={w.id}>
                <Panel>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-semibold">{w.name}</p>
                      <p className="text-sm text-steel">{fmtDay(w.date)}{w.durationMin ? `, ${w.durationMin} min` : ""}{w.assignedBy ? `, from ${w.assignedBy}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {w.status === "done" ? <Badge tone="green">Done</Badge> : <Badge>Skipped</Badge>}
                      {w.status === "done" && <Button size="sm" variant="secondary" onClick={() => duplicate(w.name)}><Copy size={14} /> Duplicate</Button>}
                    </div>
                  </div>
                  {w.exercises.length > 0 && (
                    <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                      {w.exercises.map((we, i) => (
                        <li key={i} className="flex justify-between gap-2 border-b border-line py-1">
                          <span>{exerciseById(we.exerciseId)?.name}</span>
                          <span className="tabular-nums text-steel">{we.sets.map((s) => s.weight ? `${s.weight}×${s.reps}` : `${s.reps}`).join("  ")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </li>
            ))}
          </ul>
        )}

        {tab === "records" && (
          <Panel bodyClass="p-0">
            <Table head={["Exercise", "Best", "Date"]}>
              {personalRecords.map((p) => (
                <tr key={p.exerciseId}>
                  <td className="px-4 py-3"><Link to={`/app/exercises/${p.exerciseId}`} className="font-semibold hover:text-brand">{exerciseById(p.exerciseId)?.name}</Link></td>
                  <td className="px-4 py-3 num text-lg">{p.value}</td>
                  <td className="px-4 py-3 text-steel">{fmtDay(p.date)}</td>
                </tr>
              ))}
            </Table>
          </Panel>
        )}

        {tab === "templates" && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {templates.map((t) => (
              <li key={t.id} className="panel flex flex-col p-4">
                <p className="font-display text-xl font-semibold">{t.name}</p>
                <p className="text-sm text-steel">{t.focus}. {t.perWeek} sessions a week for {t.weeks} weeks.</p>
                <div className="mt-2"><Badge tone={t.level === "Beginner" ? "green" : "yellow"}>{t.level}</Badge></div>
                <div className="mt-4 flex gap-2 pt-1">
                  <Button size="sm" onClick={() => duplicate(t.name)}>Use this program</Button>
                  <Link to="/app/workouts/new"><Button size="sm" variant="ghost">Customize</Button></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[4px] bg-iron px-4 py-2.5 text-sm text-chalk">{toast}</div>}
    </div>
  );
}
