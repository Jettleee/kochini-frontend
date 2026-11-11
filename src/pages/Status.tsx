// FIT-178 service status page
import clsx from "clsx";
import { PageHeader } from "../components/ui";
import { services } from "../lib/mock";

export function Status() {
  const ok = services.every((s) => s.status === "operational");
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Service status" sub="Updated every minute." />
      <p className={clsx("rounded-panel px-4 py-3 font-semibold", ok ? "bg-fat/10 text-fat" : "bg-carbs/15 text-[#7a5600]")}>{ok ? "All services are running normally." : "Some services are slower than usual."}</p>
      <ul className="panel divide-y divide-line">
        {services.map((s) => (
          <li key={s.name} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3"><span className="font-medium">{s.name}</span>
              <span className="flex items-center gap-2 text-sm"><span className={clsx("h-2.5 w-2.5 rounded-full", s.status === "operational" ? "bg-fat" : "bg-carbs")} />{s.status === "operational" ? "Operational" : "Degraded"}</span></div>
            {"note" in s && s.note && <p className="mt-1 text-sm text-steel">{s.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
