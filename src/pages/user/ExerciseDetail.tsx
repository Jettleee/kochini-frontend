// FIT-036 exercise detail, FIT-042 alternatives
import { ArrowLeft, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MuscleMap } from "../../components/MuscleMap";
import { Badge, Button, Empty, Panel } from "../../components/ui";
import { exerciseById, personalRecords } from "../../lib/mock";

export function ExerciseDetail() {
  const { id = "" } = useParams();
  const ex = exerciseById(id);
  const [saved, setSaved] = useState(false);
  if (!ex) return <Empty title="Exercise not found" body="It may have been archived. Go back to the library to find another one." action={<Link to="/app/exercises" className="link">Back to exercises</Link>} />;
  const pr = personalRecords.find((p) => p.exerciseId === ex.id);

  return (
    <div className="space-y-6">
      <Link to="/app/exercises" className="inline-flex items-center gap-1 text-sm text-steel hover:text-ink"><ArrowLeft size={16} /> Exercises</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>{ex.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="blue">{ex.equipment}</Badge><Badge>{ex.type}</Badge>
            <Badge tone={ex.difficulty === "Beginner" ? "green" : ex.difficulty === "Intermediate" ? "yellow" : "red"}>{ex.difficulty}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setSaved(!saved)} aria-pressed={saved}><Heart size={16} className={saved ? "fill-protein text-protein" : ""} />{saved ? "Saved" : "Save"}</Button>
          <Link to="/app/workouts/new"><Button><Plus size={16} /> Add to a workout</Button></Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="panel flex aspect-video items-center justify-center bg-iron text-chalk/70">
            <p className="text-sm">Exercise video</p>
          </div>
          <Panel title="How to do it">
            <ol className="space-y-3">
              {ex.steps.map((s, i) => (
                <li key={i} className="flex gap-3"><span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-iron text-chalk">{i + 1}</span><span className="pt-0.5">{s}</span></li>
              ))}
            </ol>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Muscles worked">
            <MuscleMap highlight={[ex.primary]} secondary={ex.secondary} />
            <p className="mt-3 text-sm"><span className="font-semibold">Primary:</span> {ex.primary}</p>
            {ex.secondary.length > 0 && <p className="text-sm"><span className="font-semibold">Also:</span> {ex.secondary.join(", ")}</p>}
          </Panel>
          {pr && <Panel title="Your best"><p className="num text-3xl">{pr.value}</p><p className="text-sm text-steel">Set on {pr.date}</p></Panel>}
          <Panel title="Alternatives">
            {ex.alternatives.length === 0 ? <p className="text-steel">No alternatives listed yet.</p> : (
              <ul className="divide-y divide-line">
                {ex.alternatives.map((aid) => { const a = exerciseById(aid)!; return (
                  <li key={aid} className="py-2"><Link to={`/app/exercises/${aid}`} className="font-semibold hover:text-brand">{a.name}</Link><p className="text-sm text-steel">{a.equipment}, {a.difficulty.toLowerCase()}</p></li>
                ); })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
