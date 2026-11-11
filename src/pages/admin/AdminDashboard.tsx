// FIT-098 admin dashboard: non-sensitive business and technical indicators
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Stat } from "../../components/ui";
import { adminStats as s, reports, services } from "../../lib/mock";

export function AdminDashboard() {
  const openReports = reports.filter((r) => r.status === "open").length;
  const degraded = services.filter((x) => x.status !== "operational");
  return (
    <div className="space-y-6">
      <PageHeader title="Overview" sub="Platform health and usage. No personal data is shown here." />
      <div className="panel grid grid-cols-2 gap-6 p-5 md:grid-cols-4">
        <Stat label="Accounts" value={s.users.toLocaleString()} />
        <Stat label="Active this week" value={s.activeWeekly.toLocaleString()} note={`${Math.round((s.activeWeekly / s.users) * 100)}% of accounts`} />
        <Stat label="Premium" value={s.premium} note={`${Math.round((s.premium / s.users) * 100)}% conversion`} />
        <Stat label="Coaches" value={s.coaches} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title="Sign-ups, last 7 days">
          <div className="h-64" role="img" aria-label={`Daily sign-ups: ${s.signups.map((x) => `${x.d} ${x.v}`).join(", ")}`}>
            <ResponsiveContainer>
              <BarChart data={s.signups} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: "var(--steel)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--steel)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} formatter={(v: number) => [v, "Sign-ups"]} />
                <Bar dataKey="v" fill="var(--plate-blue)" radius={[3, 3, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="API">
            <div className="grid grid-cols-2 gap-4"><Stat label="p95 latency" value={s.apiP95} unit="ms" /><Stat label="Error rate" value={s.errorRate} unit="%" /></div>
            <p className="mt-3 text-sm text-steel">From Azure Monitor, last 24 hours.</p>
          </Panel>
          <Panel title="Needs action">
            <ul className="space-y-2">
              <li><Link to="/admin/reports" className="font-semibold hover:text-brand">{openReports} open reports</Link></li>
              {degraded.map((d) => <li key={d.name}><Link to="/status" className="font-semibold text-[#7a5600] hover:underline">{d.name} degraded</Link></li>)}
              <li><Link to="/admin/content" className="font-semibold hover:text-brand">1 exercise in draft</Link></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
