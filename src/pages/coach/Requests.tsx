// FIT-077 coaching requests and client assignment
import { useState } from "react";
import { Avatar, Badge, Button, Empty, PageHeader } from "../../components/ui";
import { coachRequests } from "../../lib/mock";

export function Requests() {
  const [state, setState] = useState<Record<string, "accepted" | "declined">>({});
  const open = coachRequests.filter((r) => !state[r.id]);
  return (
    <div className="max-w-3xl">
      <PageHeader title="Requests" sub="People who asked you to coach them. Accepting adds them to your clients and shares the data they agreed to." />
      {coachRequests.length === 0 ? <Empty title="No requests" body="New coaching requests show up here." /> : (
        <ul className="space-y-3">
          {coachRequests.map((r) => (
            <li key={r.id} className="panel p-4">
              <div className="flex flex-wrap items-start gap-4">
                <Avatar name={r.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-semibold">{r.name}</p>
                  <p>{r.goal}</p>
                  <p className="text-sm text-steel">{r.level}. Sent {r.sent.toLowerCase()}.</p>
                  <p className="mt-2 border-l-2 border-line pl-3 text-sm italic text-steel">“{r.message}”</p>
                </div>
                {state[r.id] ? <Badge tone={state[r.id] === "accepted" ? "green" : "neutral"}>{state[r.id] === "accepted" ? "Accepted" : "Declined"}</Badge> : (
                  <div className="flex gap-2"><Button variant="ghost" onClick={() => setState({ ...state, [r.id]: "declined" })}>Decline</Button><Button onClick={() => setState({ ...state, [r.id]: "accepted" })}>Accept</Button></div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {open.length === 0 && coachRequests.length > 0 && <p className="mt-4 text-sm text-steel">All requests handled.</p>}
    </div>
  );
}
