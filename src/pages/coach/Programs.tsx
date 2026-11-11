// FIT-079 coach programs, FIT-175 templates, FIT-087 accept/edit generated plans
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, PageHeader, Panel } from "../../components/ui";
import { clients, templates } from "../../lib/mock";

export function Programs() {
  return (
    <div className="space-y-6">
      <PageHeader title="Programs" sub="Build programs once, then assign and adjust them per client."
        actions={<Link to="/coach/programs/new"><Button><Plus size={16} /> New program</Button></Link>} />
      <Panel title="Suggested plan to review">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="font-semibold">Full body, 3 days, for Nadia Ouali</p><p className="text-sm text-steel">Generated from her onboarding answers: beginner, 3 days, dumbbells only.</p></div>
          <div className="flex gap-2"><Button variant="ghost" size="sm">Decline</Button><Link to="/coach/programs/new"><Button variant="secondary" size="sm">Edit</Button></Link><Button size="sm">Accept and assign</Button></div>
        </div>
      </Panel>
      <ul className="grid gap-4 md:grid-cols-2">
        {templates.map((t) => {
          const using = clients.filter((c) => c.program === t.name);
          return (
            <li key={t.id} className="panel p-4">
              <div className="flex items-start justify-between gap-2"><p className="font-display text-xl font-semibold">{t.name}</p><Badge tone={t.level === "Beginner" ? "green" : "yellow"}>{t.level}</Badge></div>
              <p className="text-sm text-steel">{t.focus}. {t.perWeek} sessions a week, {t.weeks} weeks.</p>
              <p className="mt-3 text-sm">{using.length ? `Assigned to ${using.map((c) => c.name.split(" ")[0]).join(", ")}` : "Not assigned"}</p>
              <div className="mt-3 flex gap-2"><Link to="/coach/programs/new"><Button size="sm" variant="secondary">Edit</Button></Link><Button size="sm" variant="ghost">Assign to client</Button></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
