// FIT-029 onboarding (goal, level, availability, equipment) + FIT-031/032 units, diet, allergies
import clsx from "clsx";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { Button, Chip } from "../../components/ui";
import { useAuth } from "../../lib/auth";

const STEPS = ["Goal", "Experience", "Schedule", "Equipment", "Food"] as const;

const GOALS = [
  { v: "lose", t: "Lose fat", d: "Calorie target below maintenance, strength work to keep muscle." },
  { v: "gain", t: "Build muscle", d: "Small surplus and higher training volume." },
  { v: "strength", t: "Get stronger", d: "Lower reps on the big lifts, tracked personal records." },
  { v: "maintain", t: "Stay healthy", d: "Balanced training and nutrition without a strict target." },
];
const LEVELS = [
  { v: "beginner", t: "New to training", d: "Less than 6 months of regular workouts." },
  { v: "intermediate", t: "Some experience", d: "You know the main lifts and train most weeks." },
  { v: "advanced", t: "Experienced", d: "Years of structured training and programming." },
];
const EQUIP = ["Full gym", "Dumbbells", "Barbell & rack", "Kettlebell", "Resistance bands", "Pull-up bar", "No equipment"];
const DIETS = ["No preference", "High protein", "Vegetarian", "Vegan", "Halal", "Low carb"];
const ALLERGENS = ["Peanuts", "Tree nuts", "Gluten", "Lactose", "Eggs", "Fish", "Shellfish", "Soy"];

function Option({ selected, title, desc, onClick }: { selected: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={clsx("flex w-full items-start gap-3 rounded-panel border bg-surface p-4 text-left", selected ? "border-brand ring-2 ring-brand/20" : "border-line hover:border-steel")}
    >
      <span className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-brand bg-brand text-white" : "border-line")}>{selected && <Check size={13} />}</span>
      <span><span className="block font-semibold">{title}</span><span className="text-sm text-steel">{desc}</span></span>
    </button>
  );
}

export function Onboarding() {
  const { session, update } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState({
    goal: "lose", level: "beginner", days: 3, minutes: 45, equipment: ["Dumbbells"] as string[],
    weightUnit: "kg", lengthUnit: "cm", diet: ["No preference"] as string[], allergies: [] as string[],
  });
  const toggle = (k: "equipment" | "diet" | "allergies", v: string) =>
    setA((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));

  const finish = () => { update({ onboarded: true }); nav("/app"); }; // PUT /api/me/profile

  return (
    <div className="min-h-screen bg-chalk">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Logo />
          <span className="text-sm text-steel">Step {step + 1} of {STEPS.length}</span>
        </div>
        <ol className="mx-auto flex max-w-2xl gap-1 px-4 pb-3" aria-label="Setup progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <span className={clsx("block h-1.5 rounded-full", i <= step ? "bg-brand" : "bg-line")} />
              <span className={clsx("mt-1 hidden text-xs sm:block", i === step ? "font-semibold text-ink" : "text-steel")}>{s}</span>
            </li>
          ))}
        </ol>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {step === 0 && (
          <section>
            <h1>{session?.name ? `What are you training for, ${session.name.split(" ")[0]}?` : "What are you training for?"}</h1>
            <p className="mt-2 text-steel">This sets your calorie target and the programs we suggest. You can change it later.</p>
            <div role="radiogroup" aria-label="Goal" className="mt-6 grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => <Option key={g.v} selected={a.goal === g.v} title={g.t} desc={g.d} onClick={() => setA({ ...a, goal: g.v })} />)}
            </div>
          </section>
        )}
        {step === 1 && (
          <section>
            <h1>How much have you trained before?</h1>
            <p className="mt-2 text-steel">We use this to pick starting weights and exercise difficulty.</p>
            <div role="radiogroup" aria-label="Experience" className="mt-6 space-y-3">
              {LEVELS.map((l) => <Option key={l.v} selected={a.level === l.v} title={l.t} desc={l.d} onClick={() => setA({ ...a, level: l.v })} />)}
            </div>
          </section>
        )}
        {step === 2 && (
          <section>
            <h1>How often can you train?</h1>
            <p className="mt-2 text-steel">Be realistic. A plan you can keep beats an ambitious one you skip.</p>
            <div className="mt-8 space-y-8">
              <div>
                <p className="font-semibold">Days per week</p>
                <div className="mt-3 flex gap-2">
                  {[2, 3, 4, 5, 6].map((d) => (
                    <button key={d} type="button" aria-pressed={a.days === d} onClick={() => setA({ ...a, days: d })}
                      className={clsx("num h-14 w-14 rounded-panel border text-2xl", a.days === d ? "border-iron bg-iron text-chalk" : "border-line bg-surface hover:border-steel")}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="mins" className="font-semibold">Minutes per session: <span className="num text-xl">{a.minutes}</span></label>
                <input id="mins" type="range" min={20} max={90} step={5} value={a.minutes} onChange={(e) => setA({ ...a, minutes: +e.target.value })} className="mt-3 w-full accent-[var(--plate-blue)]" />
              </div>
            </div>
          </section>
        )}
        {step === 3 && (
          <section>
            <h1>What equipment do you have?</h1>
            <p className="mt-2 text-steel">Select everything you can use. Exercises you can't do will be swapped for alternatives.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {EQUIP.map((e) => <Chip key={e} active={a.equipment.includes(e)} onClick={() => toggle("equipment", e)}>{e}</Chip>)}
            </div>
          </section>
        )}
        {step === 4 && (
          <section className="space-y-8">
            <div>
              <h1>Food and units</h1>
              <p className="mt-2 text-steel">Food suggestions will skip anything you mark as an allergy.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <fieldset><legend className="font-semibold">Weight</legend>
                <div className="mt-2 flex gap-2">{["kg", "lb"].map((u) => <Chip key={u} active={a.weightUnit === u} onClick={() => setA({ ...a, weightUnit: u })}>{u}</Chip>)}</div>
              </fieldset>
              <fieldset><legend className="font-semibold">Length</legend>
                <div className="mt-2 flex gap-2">{["cm", "in"].map((u) => <Chip key={u} active={a.lengthUnit === u} onClick={() => setA({ ...a, lengthUnit: u })}>{u}</Chip>)}</div>
              </fieldset>
            </div>
            <fieldset><legend className="font-semibold">Diet</legend>
              <div className="mt-2 flex flex-wrap gap-2">{DIETS.map((d) => <Chip key={d} active={a.diet.includes(d)} onClick={() => toggle("diet", d)}>{d}</Chip>)}</div>
            </fieldset>
            <fieldset><legend className="font-semibold">Allergies and intolerances</legend>
              <div className="mt-2 flex flex-wrap gap-2">{ALLERGENS.map((d) => <Chip key={d} active={a.allergies.includes(d)} onClick={() => toggle("allergies", d)}>{d}</Chip>)}</div>
            </fieldset>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep(step + 1)} disabled={step === 3 && a.equipment.length === 0}>Continue</Button>
            : <Button onClick={finish}>Finish setup</Button>}
        </div>
      </main>
    </div>
  );
}
