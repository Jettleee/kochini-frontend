// FIT-101 audit log of admin actions and critical changes
import { Search } from "lucide-react";
import { useState } from "react";
import { Input, PageHeader, Table } from "../../components/ui";
import { auditLog } from "../../lib/mock";

export function Audit() {
  const [q, setQ] = useState("");
  const rows = auditLog.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Audit log" sub="Read-only. Entries are kept for 12 months." />
      <div className="relative max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
        <Input aria-label="Filter by actor, action or target" placeholder="Filter by actor, action or target" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="panel">
        <Table head={["Time (UTC)", "Actor", "Action", "Target", "IP"]}>
          {rows.map((r, i) => (
            <tr key={i} className="text-sm">
              <td className="px-4 py-3 whitespace-nowrap tabular-nums text-steel">{r.at}</td><td className="px-4 py-3">{r.actor}</td>
              <td className="px-4 py-3"><code className="rounded bg-chalk px-1.5 py-0.5 text-[13px]">{r.action}</code></td>
              <td className="px-4 py-3">{r.target}</td><td className="px-4 py-3 tabular-nums text-steel">{r.ip}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-steel">No entries match “{q}”.</td></tr>}
        </Table>
      </div>
    </div>
  );
}
