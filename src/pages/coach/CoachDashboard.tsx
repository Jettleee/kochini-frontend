// FIT-076 coach workspace: assigned clients, status, useful progress
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Chip, Input, Meter, PageHeader, Stat } from "../../components/ui";
import { clients, coachRequests } from "../../lib/mock";

const STATUS = { "on-track": { t: "On track", tone: "green" }, "needs-attention": { t: "Needs attention", tone: "red" }, new: { t: "New", tone: "blue" } } as const;

export function CoachDashboard() {
  const [filter, setFilter] = useState<"all" | keyof typeof STATUS>("all");
  const [q, setQ] = useState("");
  const list = clients.filter((c) => (filter === "all" || c.status === filter) && c.name.toLowerCase().includes(q.toLowerCase()));
  const attention = clients.filter((c) => c.status === "needs-attention");

  return (
    <div className="space-y-6">
      <PageHeader title="Clients" sub="Who needs you this week, at a glance." />
      <div className="panel grid grid-cols-2 gap-6 p-5 md:grid-cols-4">
        <Stat label="Active clients" value={clients.length} />
        <Stat label="Need attention" value={attention.length} note="Low adherence or inactive" />
        <Stat label="Avg. adherence" value={`${Math.round(clients.filter((c) => c.status !== "new").reduce((a, c) => a + c.adherence, 0) / (clients.length - 1))}%`} note="Last 14 days" />
        <Stat label="Open requests" value={coachRequests.length} note={<Link to="/coach/requests" className="link">Review</Link>} />
      </div>

      {attention.length > 0 && (
        <section aria-labelledby="att" className="rounded-panel border-l-4 border-protein bg-surface p-4">
          <h2 id="att" className="text-lg">Check in today</h2>
          <ul className="mt-2 space-y-1">
            {attention.map((c) => <li key={c.id}><Link to={`/coach/clients/${c.id}`} className="font-semibold hover:text-brand">{c.name}</Link> <span className="text-steel">completed {c.adherence}% of sessions, last active {c.lastActive.toLowerCase()}.</span></li>)}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <Input aria-label="Search clients" placeholder="Search clients" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        {(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((s) => <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{STATUS[s].t}</Chip>)}
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead><tr className="border-b border-line text-sm text-steel">
            <th scope="col" className="px-4 py-2 font-semibold">Client</th><th scope="col" className="px-4 py-2 font-semibold">Program</th>
            <th scope="col" className="px-4 py-2 font-semibold w-44">Adherence</th><th scope="col" className="px-4 py-2 font-semibold">Weight, 30 days</th>
            <th scope="col" className="px-4 py-2 font-semibold">Last active</th><th scope="col" className="px-4 py-2 font-semibold">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-line">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-black/[0.015]">
                <td className="px-4 py-3"><Link to={`/coach/clients/${c.id}`} className="flex items-center gap-3 font-semibold hover:text-brand"><Avatar name={c.name} size={32} /><span>{c.name}<span className="block text-sm font-normal text-steel">{c.goal}</span></span></Link></td>
                <td className="px-4 py-3 text-sm">{c.program}</td>
                <td className="px-4 py-3">{c.status === "new" ? <span className="text-sm text-steel">No data yet</span> : <div className="flex items-center gap-2"><Meter value={c.adherence} max={100} label={`${c.name} adherence`} color={c.adherence < 60 ? "var(--plate-red)" : "var(--plate-green)"} /><span className="num w-10 text-right">{c.adherence}%</span></div>}</td>
                <td className="px-4 py-3 tabular-nums">{c.status === "new" ? "–" : `${c.weightTrend > 0 ? "+" : ""}${c.weightTrend} kg`}</td>
                <td className="px-4 py-3 text-sm text-steel">{c.lastActive}</td>
                <td className="px-4 py-3"><Badge tone={STATUS[c.status].tone}>{STATUS[c.status].t}</Badge></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-steel">No clients match. Clear the search or pick another status.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
