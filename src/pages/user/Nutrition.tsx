// FIT-051..059 food search, detail, custom food, diary by meal, daily macros, portions, goals vs intake,
// copy previous day, favourites; FIT-060 barcode (extension); FIT-174 CSV export
import { ChevronLeft, ChevronRight, Copy, Download, Plus, ScanBarcode, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Chip, Field, Input, Meter, Modal, PageHeader, Select } from "../../components/ui";
import { addDays, fmtDay, round, scaleFood } from "../../lib/format";
import { foodById, foods, goals, mealLog, TODAY } from "../../lib/mock";
import type { Food, MealEntry, MealSlot } from "../../lib/types";

const SLOTS: MealSlot[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export function Nutrition() {
  const [day, setDay] = useState(TODAY);
  const [log, setLog] = useState<MealEntry[]>(mealLog);
  const [adding, setAdding] = useState<MealSlot | null>(null);
  const [picked, setPicked] = useState<Food | null>(null);
  const [qty, setQty] = useState(100);
  const [q, setQ] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [favs] = useState(["f2", "f4", "f12"]);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const entries = day === TODAY ? log : [];
  const t = useMemo(() => entries.reduce((a, m) => { const s = scaleFood(foodById(m.foodId), m.qty); return { kcal: a.kcal + s.kcal, protein: a.protein + s.protein, carbs: a.carbs + s.carbs, fat: a.fat + s.fat }; }, { kcal: 0, protein: 0, carbs: 0, fat: 0 }), [entries]);
  const results = foods.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()) || f.brand?.toLowerCase().includes(q.toLowerCase()));

  const open = (slot: MealSlot) => { setAdding(slot); setPicked(null); setQ(""); };
  const choose = (f: Food) => { setPicked(f); setQty(f.per); };
  const add = () => {
    if (!picked || !adding) return;
    setLog((l) => [...l, { id: crypto.randomUUID(), foodId: picked.id, slot: adding, qty }]);
    flash(`Added ${picked.name} to ${adding.toLowerCase()}.`);
    setAdding(null);
  };

  function exportCsv() {
    const rows = [["date", "meal", "food", "qty", "kcal", "protein_g", "carbs_g", "fat_g"], ...log.map((m) => { const f = foodById(m.foodId); const s = scaleFood(f, m.qty); return [day, m.slot, f.name, `${m.qty}${f.unit}`, round(s.kcal), round(s.protein, 1), round(s.carbs, 1), round(s.fat, 1)]; })];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `food-diary-${day}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  const macros = [
    { key: "protein", label: "Protein", value: t.protein, goal: goals.protein, color: "var(--plate-red)" },
    { key: "carbs", label: "Carbs", value: t.carbs, goal: goals.carbs, color: "var(--plate-yellow)" },
    { key: "fat", label: "Fat", value: t.fat, goal: goals.fat, color: "var(--plate-green)" },
  ];

  return (
    <div>
      <PageHeader title="Nutrition" sub="Log what you eat by meal. Totals update as you go."
        actions={<Button variant="secondary" onClick={exportCsv}><Download size={16} /> Export CSV</Button>} />

      <div className="mb-4 flex items-center gap-2">
        <Button size="sm" variant="secondary" aria-label="Previous day" onClick={() => setDay(addDays(day, -1))}><ChevronLeft size={16} /></Button>
        <Button size="sm" variant="secondary" aria-label="Next day" onClick={() => setDay(addDays(day, 1))} disabled={day >= TODAY}><ChevronRight size={16} /></Button>
        <p className="font-semibold">{day === TODAY ? "Today" : fmtDay(day)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {SLOTS.map((slot) => {
            const items = entries.filter((m) => m.slot === slot);
            const kcal = items.reduce((a, m) => a + scaleFood(foodById(m.foodId), m.qty).kcal, 0);
            return (
              <section key={slot} className="panel" aria-labelledby={`slot-${slot}`}>
                <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
                  <h2 id={`slot-${slot}`} className="text-lg">{slot}</h2>
                  <span className="num text-lg">{Math.round(kcal)} <span className="font-sans text-sm font-normal text-steel">kcal</span></span>
                </header>
                {items.length > 0 && (
                  <ul className="divide-y divide-line">
                    {items.map((m) => {
                      const f = foodById(m.foodId); const s = scaleFood(f, m.qty);
                      return (
                        <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{f.name}</p>
                            <p className="text-sm text-steel tabular-nums">
                              <span className="text-danger">P {round(s.protein)}</span>{"  "}
                              <span className="text-[#7a5600]">C {round(s.carbs)}</span>{"  "}
                              <span className="text-fat">F {round(s.fat)}</span>
                            </p>
                          </div>
                          <label className="sr-only" htmlFor={`q-${m.id}`}>Quantity for {f.name}</label>
                          <div className="flex items-center gap-1">
                            <input id={`q-${m.id}`} inputMode="numeric" className="input h-8 w-16 text-right" value={m.qty}
                              onChange={(e) => setLog((l) => l.map((x) => x.id === m.id ? { ...x, qty: +e.target.value || 0 } : x))} />
                            <span className="w-5 text-sm text-steel">{f.unit}</span>
                          </div>
                          <span className="num w-12 text-right">{Math.round(s.kcal)}</span>
                          <button aria-label={`Remove ${f.name}`} className="rounded p-1 text-steel hover:text-danger" onClick={() => setLog((l) => l.filter((x) => x.id !== m.id))}><Trash2 size={16} /></button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2 px-4 py-2.5">
                  <Button size="sm" variant="ghost" onClick={() => open(slot)}><Plus size={14} /> Add food</Button>
                  {items.length === 0 && <Button size="sm" variant="ghost" onClick={() => flash(`Copied yesterday's ${slot.toLowerCase()}.`)}><Copy size={14} /> Copy from yesterday</Button>}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="panel p-4">
            <p className="text-sm text-steel">Calories</p>
            <p><span className="num text-[2.5rem] leading-none">{Math.round(t.kcal)}</span><span className="ml-1 text-steel">/ {goals.kcal}</span></p>
            <div className="mt-2"><Meter value={t.kcal} max={goals.kcal} color="var(--iron)" label="Calories against goal" /></div>
            <ul className="mt-4 space-y-3">
              {macros.map((m) => (
                <li key={m.key}>
                  <div className="flex justify-between text-sm"><span className="font-semibold">{m.label}</span><span className="tabular-nums text-steel">{Math.round(m.value)} / {m.goal} g</span></div>
                  <div className="mt-1"><Meter value={m.value} max={m.goal} color={m.color} label={`${m.label} against goal`} /></div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-steel">Targets come from your goal and are adjusted by your coach.</p>
        </aside>
      </div>

      <Modal open={!!adding} onClose={() => setAdding(null)} title={picked ? picked.name : `Add to ${adding?.toLowerCase()}`} wide>
        {!picked ? (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
                <Input autoFocus aria-label="Search food" placeholder="Search food or brand" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Button variant="secondary" aria-label="Scan barcode" onClick={() => flash("Barcode scanning needs camera access and is coming in a later release.")}><ScanBarcode size={18} /></Button>
            </div>
            {!q && <div className="mt-3 flex flex-wrap gap-2">{favs.map((id) => <Chip key={id} onClick={() => choose(foodById(id))}><Star size={12} className="mr-1 inline fill-carbs text-carbs" />{foodById(id).name}</Chip>)}</div>}
            <ul className="mt-3 max-h-80 divide-y divide-line overflow-y-auto">
              {results.map((f) => (
                <li key={f.id}><button onClick={() => choose(f)} className="flex w-full items-center justify-between gap-3 px-1 py-2.5 text-left hover:bg-black/[0.03]">
                  <span><span className="block font-semibold">{f.name}{f.custom && <span className="ml-2 text-xs font-normal text-steel">Your food</span>}</span><span className="text-sm text-steel">{f.brand ? `${f.brand}, ` : ""}{f.per} {f.unit}</span></span>
                  <span className="num">{f.kcal} <span className="font-sans text-sm font-normal text-steel">kcal</span></span>
                </button></li>
              ))}
              {results.length === 0 && <li className="py-4 text-steel">No food called “{q}”. Add it yourself and it will be saved for next time.</li>}
            </ul>
            <button className="link mt-3 text-sm" onClick={() => setCustomOpen(true)}>Create a custom food</button>
          </>
        ) : (
          <FoodDetail food={picked} qty={qty} setQty={setQty} onBack={() => setPicked(null)} onAdd={add} slot={adding!} />
        )}
      </Modal>

      <Modal open={customOpen} onClose={() => setCustomOpen(false)} title="Custom food">
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setCustomOpen(false); flash("Custom food saved."); }}>
          <Field label="Name">{(id) => <Input id={id} required placeholder="Homemade harira" />}</Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Portion">{(id) => <Input id={id} type="number" defaultValue={100} />}</Field>
            <Field label="Unit">{(id) => <Select id={id}><option>g</option><option>ml</option></Select>}</Field>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Calories", "Protein (g)", "Carbs (g)", "Fat (g)"].map((l) => <Field key={l} label={l}>{(id) => <Input id={id} type="number" min={0} required />}</Field>)}
          </div>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" onClick={() => setCustomOpen(false)}>Cancel</Button><Button type="submit">Save food</Button></div>
        </form>
      </Modal>

      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[4px] bg-iron px-4 py-2.5 text-sm text-chalk">{toast}</div>}
    </div>
  );
}

function FoodDetail({ food, qty, setQty, onBack, onAdd, slot }: { food: Food; qty: number; setQty: (n: number) => void; onBack: () => void; onAdd: () => void; slot: MealSlot }) {
  const s = scaleFood(food, qty);
  return (
    <div>
      <button onClick={onBack} className="text-sm text-steel hover:text-ink">← Back to search</button>
      <p className="mt-2 text-sm text-steel">{food.brand ? `${food.brand}. ` : ""}Values per {food.per} {food.unit}: {food.kcal} kcal</p>
      <div className="mt-4 flex items-end gap-3">
        <Field label="Quantity">{(id) => <Input id={id} type="number" min={1} value={qty} onChange={(e) => setQty(+e.target.value || 0)} className="w-28" />}</Field>
        <span className="pb-2 text-steel">{food.unit}</span>
        <div className="flex flex-wrap gap-1 pb-1">{[0.5, 1, 1.5, 2].map((k) => <Chip key={k} active={qty === food.per * k} onClick={() => setQty(food.per * k)}>{k}×</Chip>)}</div>
      </div>
      <dl className="mt-5 grid grid-cols-4 gap-px overflow-hidden rounded-panel border border-line bg-line text-center">
        {[["kcal", s.kcal, "var(--iron)"], ["Protein", s.protein, "var(--plate-red)"], ["Carbs", s.carbs, "var(--plate-yellow)"], ["Fat", s.fat, "var(--plate-green)"]].map(([k, v, c]) => (
          <div key={k as string} className="bg-surface px-2 py-3" style={{ boxShadow: `inset 0 3px 0 ${c}` }}>
            <dt className="text-sm text-steel">{k as string}</dt><dd className="num text-2xl">{round(v as number, k === "kcal" ? 0 : 1)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex justify-end"><Button onClick={onAdd} disabled={qty <= 0}>Add to {slot.toLowerCase()}</Button></div>
    </div>
  );
}
