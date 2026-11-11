// FIT-081 coach availability and appointment requests
import clsx from "clsx";
import { useState } from "react";
import { Badge, Button, PageHeader, Panel } from "../../components/ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [8, 10, 12, 14, 16, 18, 20];
const BOOKED: Record<string, string> = { "Mon-18": "Sara B.", "Wed-18": "Lina H.", "Fri-18": "Omar E." };

export function Schedule() {
  const [open, setOpen] = useState<Set<string>>(new Set(["Mon-18", "Mon-20", "Wed-18", "Wed-20", "Fri-18", "Fri-20", "Sat-10"]));
  const flip = (k: string) => setOpen((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return (
    <div className="space-y-6">
      <PageHeader title="Schedule" sub="Click a slot to open or close it for check-in calls. Booked slots can't be closed." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Panel title="Weekly availability" bodyClass="overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-1 text-sm">
            <thead><tr><th className="w-14" />{DAYS.map((d) => <th key={d} scope="col" className="font-semibold text-steel">{d}</th>)}</tr></thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h}>
                  <th scope="row" className="pr-2 text-right font-normal text-steel tabular-nums">{h}:00</th>
                  {DAYS.map((d) => {
                    const k = `${d}-${h}`; const b = BOOKED[k]; const on = open.has(k);
                    return (
                      <td key={k}>
                        <button disabled={!!b} onClick={() => flip(k)} aria-pressed={on} aria-label={`${d} ${h}:00, ${b ? `booked by ${b}` : on ? "open" : "closed"}`}
                          className={clsx("h-10 w-full rounded-[4px] text-xs font-semibold", b ? "bg-iron text-chalk" : on ? "bg-brand-soft text-brand ring-1 ring-brand/30" : "bg-black/[0.04] hover:bg-black/[0.08]")}>
                          {b ?? (on ? "Open" : "")}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Booking requests">
          <ul className="space-y-4">
            {[{ n: "Mehdi Tazi", w: "Thu 20:00", r: "Missed sessions, wants to adjust the plan" }, { n: "Nadia Ouali", w: "Sat 10:00", r: "First call, goals and onboarding" }].map((x) => (
              <li key={x.n} className="border-b border-line pb-4 last:border-0 last:pb-0">
                <p className="font-semibold">{x.n}</p><p className="text-sm"><Badge tone="blue">{x.w}</Badge></p>
                <p className="mt-1 text-sm text-steel">{x.r}</p>
                <div className="mt-2 flex gap-2"><Button size="sm">Confirm</Button><Button size="sm" variant="ghost">Suggest another time</Button></div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
