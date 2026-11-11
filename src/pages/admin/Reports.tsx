// FIT-102 reports and support
import { useState } from "react";
import { Badge, Button, Chip, PageHeader } from "../../components/ui";
import { reports } from "../../lib/mock";

export function Reports() {
  const [list, setList] = useState(reports.map((r) => ({ ...r })));
  const [show, setShow] = useState<"open" | "resolved">("open");
  const shown = list.filter((r) => r.status === show);
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Reports" sub="Content and behaviour flagged by users and coaches." />
      <div className="flex gap-2"><Chip active={show === "open"} onClick={() => setShow("open")}>Open ({list.filter((r) => r.status === "open").length})</Chip><Chip active={show === "resolved"} onClick={() => setShow("resolved")}>Resolved</Chip></div>
      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.id} className="panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><Badge tone="yellow">{r.kind}</Badge><p className="mt-1.5 font-semibold">{r.target}</p><p className="text-sm text-steel">Reported by {r.by}, {r.at.toLowerCase()}</p></div>
              {r.status === "open" && <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => setList(list.map((x) => x.id === r.id ? { ...x, status: "resolved" } : x))}>Dismiss</Button><Button size="sm" onClick={() => setList(list.map((x) => x.id === r.id ? { ...x, status: "resolved" } : x))}>Fix and resolve</Button></div>}
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="rounded-panel border border-dashed border-line p-6 text-steel">Nothing {show} right now.</li>}
      </ul>
    </div>
  );
}
