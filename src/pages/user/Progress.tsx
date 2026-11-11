// FIT-062 log weight, FIT-063 weight chart (7/30 days/custom), FIT-064 measurements,
// FIT-065 private progress photos, FIT-066 trend vs goal
import { Camera, Lock, Plus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Chip, Field, Input, PageHeader, Panel, Stat, Table } from "../../components/ui";
import { addDays, fmtShort, round } from "../../lib/format";
import { goals, measurements, TODAY, weightLog } from "../../lib/mock";

const RANGES = [{ k: 7, l: "7 days" }, { k: 30, l: "30 days" }, { k: 90, l: "90 days" }] as const;

export function Progress() {
  const [range, setRange] = useState<number>(30);
  const [log, setLog] = useState(weightLog);
  const [kg, setKg] = useState("");
  const [date, setDate] = useState(TODAY);
  const [err, setErr] = useState<string>();

  const data = useMemo(() => log.filter((w) => w.date >= addDays(TODAY, -range)).map((w) => ({ ...w, label: fmtShort(w.date) })), [log, range]);
  const start = log[0].kg, now = log[log.length - 1].kg;
  const lost = round(start - now, 1);
  const toGo = round(now - goals.weightKg, 1);
  const pct = Math.round((lost / (start - goals.weightKg)) * 100);

  function add(e: FormEvent) {
    e.preventDefault();
    const v = parseFloat(kg);
    if (!v || v < 25 || v > 300) { setErr("Enter a weight between 25 and 300 kg."); return; }
    setErr(undefined);
    setLog((l) => [...l.filter((x) => x.date !== date), { date, kg: v }].sort((a, b) => a.date.localeCompare(b.date)));
    setKg("");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Progress" sub="Weigh in at the same time of day for a cleaner trend." />

      <div className="panel grid gap-6 p-5 sm:grid-cols-4">
        <Stat label="Current" value={now} unit="kg" />
        <Stat label="Since you started" value={`−${lost}`} unit="kg" note={`From ${start} kg on 8 Sep`} />
        <Stat label="To goal" value={toGo} unit="kg" note={`Goal ${goals.weightKg} kg`} />
        <div>
          <p className="text-sm text-steel">Goal progress</p>
          <p className="num text-[2rem] leading-none">{pct}%</p>
          <div className="mt-2 flex h-3 gap-0.5" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => <span key={i} className="flex-1 rounded-sm" style={{ background: i < Math.round(pct / 10) ? "var(--plate-blue)" : "var(--line)" }} />)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title="Weight" action={<div className="flex gap-1">{RANGES.map((r) => <Chip key={r.k} active={range === r.k} onClick={() => setRange(r.k)}>{r.l}</Chip>)}</div>}>
          <div className="h-72" role="img" aria-label={`Weight over the last ${range} days, from ${data[0]?.kg} to ${now} kg`}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--steel)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[(m: number) => Math.floor(Math.min(m, goals.weightKg) - 1), (m: number) => Math.ceil(m + 0.5)]} tick={{ fontSize: 12, fill: "var(--steel)" }} tickLine={false} axisLine={false} />
                <ReferenceLine y={goals.weightKg} stroke="var(--plate-green)" strokeDasharray="4 4" label={{ value: `Goal ${goals.weightKg}`, position: "insideBottomRight", fill: "var(--plate-green)", fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v} kg`, "Weight"]} contentStyle={{ borderRadius: 6, border: "1px solid var(--line)" }} />
                <Line type="monotone" dataKey="kg" stroke="var(--iron)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--iron)" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Log weight">
          <form onSubmit={add} className="space-y-3" noValidate>
            <Field label="Weight (kg)" error={err}>{(id, d) => <Input id={id} inputMode="decimal" aria-invalid={!!err} aria-describedby={d} value={kg} onChange={(e) => setKg(e.target.value)} placeholder="65.2" />}</Field>
            <Field label="Date">{(id) => <Input id={id} type="date" max={TODAY} value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
            <Button type="submit" className="w-full"><Plus size={16} /> Save weight</Button>
          </form>
          <ul className="mt-4 divide-y divide-line text-sm">
            {log.slice(-4).reverse().map((w) => <li key={w.date} className="flex justify-between py-1.5"><span className="text-steel">{fmtShort(w.date)}</span><span className="tabular-nums font-semibold">{w.kg} kg</span></li>)}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Measurements" action={<Button size="sm" variant="secondary"><Plus size={14} /> Add</Button>} bodyClass="p-0">
          <Table head={["", "Start", "Now", "Change"]}>
            {measurements.map((m) => {
              const d = round(m.now - m.start, 1);
              return (
                <tr key={m.label}>
                  <td className="px-4 py-2.5 font-semibold">{m.label}</td>
                  <td className="px-4 py-2.5 tabular-nums text-steel">{m.start} {m.unit}</td>
                  <td className="px-4 py-2.5 tabular-nums">{m.now} {m.unit}</td>
                  <td className="px-4 py-2.5 tabular-nums font-semibold" style={{ color: d < 0 ? "var(--plate-green)" : "var(--steel)" }}>{d > 0 ? `+${d}` : d}</td>
                </tr>
              );
            })}
          </Table>
        </Panel>

        <Panel title="Progress photos" action={<span className="flex items-center gap-1 text-sm text-steel"><Lock size={14} /> Only you</span>}>
          <div className="grid grid-cols-3 gap-2">
            {["8 Sep", "6 Oct", "2 Nov"].map((d) => (
              <figure key={d}>
                <div className="flex aspect-[3/4] items-center justify-center rounded-[4px] bg-[repeating-linear-gradient(135deg,#e3e6e1_0_6px,#eceee9_6px_12px)] text-steel"><Camera size={20} /></div>
                <figcaption className="mt-1 text-center text-xs text-steel">{d}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-sm text-steel">Photos are private by default. You choose whether your coach can see them.</p>
          <Button size="sm" variant="secondary" className="mt-3"><Camera size={14} /> Add photo</Button>
        </Panel>
      </div>
    </div>
  );
}
