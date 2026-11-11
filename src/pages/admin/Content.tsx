// FIT-100 moderate catalogue: publish, archive, fix exercises and foods
import { useState } from "react";
import { Badge, Button, PageHeader, Table, Tabs } from "../../components/ui";
import { exercises, foods } from "../../lib/mock";

export function Content() {
  const [tab, setTab] = useState<"exercises" | "foods">("exercises");
  const [status, setStatus] = useState<Record<string, string>>(Object.fromEntries(exercises.map((e) => [e.id, e.status ?? "published"])));
  const tone = (s: string) => (s === "published" ? "green" : s === "draft" ? "yellow" : "neutral") as "green" | "yellow" | "neutral";
  return (
    <div className="space-y-6">
      <PageHeader title="Content" sub="Exercises and foods that athletes see. Drafts are only visible to admins." actions={<Button>Add {tab === "exercises" ? "exercise" : "food"}</Button>} />
      <Tabs label="Content type" value={tab} onChange={setTab} items={[{ value: "exercises", label: `Exercises (${exercises.length})` }, { value: "foods", label: `Foods (${foods.length})` }]} />
      <div className="panel">
        {tab === "exercises" ? (
          <Table head={["Exercise", "Muscle", "Equipment", "Status", ""]}>
            {exercises.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 font-semibold">{e.name}</td><td className="px-4 py-3 text-sm">{e.primary}</td><td className="px-4 py-3 text-sm">{e.equipment}</td>
                <td className="px-4 py-3"><Badge tone={tone(status[e.id])}>{status[e.id][0].toUpperCase() + status[e.id].slice(1)}</Badge></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost">Edit</Button>
                  {status[e.id] !== "published" ? <Button size="sm" variant="secondary" onClick={() => setStatus({ ...status, [e.id]: "published" })}>Publish</Button>
                    : <Button size="sm" variant="ghost" onClick={() => setStatus({ ...status, [e.id]: "archived" })}>Archive</Button>}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table head={["Food", "Per", "kcal", "P / C / F", "Source", ""]}>
            {foods.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 font-semibold">{f.name}{f.brand && <span className="block text-sm font-normal text-steel">{f.brand}</span>}</td>
                <td className="px-4 py-3 text-sm tabular-nums">{f.per} {f.unit}</td><td className="px-4 py-3 tabular-nums">{f.kcal}</td>
                <td className="px-4 py-3 text-sm tabular-nums">{f.protein} / {f.carbs} / {f.fat}</td>
                <td className="px-4 py-3">{f.custom ? <Badge tone="yellow">Community</Badge> : <Badge>Catalogue</Badge>}</td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
