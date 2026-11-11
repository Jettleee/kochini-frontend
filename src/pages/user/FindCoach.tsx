// FIT-077 request a coach
import { useState } from "react";
import { Avatar, Badge, Button, Field, Modal, PageHeader } from "../../components/ui";
import { coaches } from "../../lib/mock";

export function FindCoach() {
  const [req, setReq] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const coach = coaches.find((c) => c.id === req);
  return (
    <div className="max-w-3xl">
      <PageHeader title="Find a coach" sub="Send a request with your goal. The coach accepts or suggests someone better suited." />
      <ul className="space-y-3">
        {coaches.map((c) => (
          <li key={c.id} className="panel flex flex-wrap items-center gap-4 p-4">
            <Avatar name={c.name} size={48} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-semibold">{c.name}</p>
              <p className="text-steel">{c.specialty}</p>
              <p className="text-sm text-steel">{c.clients} clients, rated {c.rating}. Available {c.slots.toLowerCase()}.</p>
            </div>
            {sent.includes(c.id) ? <Badge tone="blue">Request sent</Badge> : <Button variant="secondary" onClick={() => setReq(c.id)}>Request coaching</Button>}
          </li>
        ))}
      </ul>
      <Modal open={!!req} onClose={() => setReq(null)} title={`Request ${coach?.name.split(" ")[0] ?? ""} as your coach`}>
        <form onSubmit={(e) => { e.preventDefault(); setSent([...sent, req!]); setReq(null); }} className="space-y-4">
          <Field label="What do you want help with?" hint="Your goal, schedule and any injuries.">{(id, d) => <textarea id={id} aria-describedby={d} rows={4} className="input" required />}</Field>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-[var(--plate-blue)]" /> Share my workouts and weight with this coach if they accept</label>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setReq(null)}>Cancel</Button><Button type="submit">Send request</Button></div>
        </form>
      </Modal>
    </div>
  );
}
