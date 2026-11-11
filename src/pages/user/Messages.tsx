// FIT-092 coach–client chat, FIT-177 comments linked to a session/program, FIT-096 video call (extension)
import clsx from "clsx";
import { ArrowLeft, Paperclip, Send, Video } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button } from "../../components/ui";
import { conversations, messages as seed } from "../../lib/mock";
import type { Message } from "../../lib/types";

export function Messages({ coachView }: { coachView?: boolean }) {
  const [msgs, setMsgs] = useState<Message[]>(() => seed.map((m) => coachView ? { ...m, mine: !m.mine } : m));
  const [text, setText] = useState("");
  const [active, setActive] = useState<string | null>(coachView ? null : "c1");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: "end" }), [msgs, active]);
  const other = coachView ? conversations.find((c) => c.id === active)?.name ?? "" : "Youssef Amrani";

  function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), from: "me", body: text.trim(), at: "Now", mine: true }]);
    setText("");
  }

  const thread = (
    <section className="panel flex h-[calc(100vh-180px)] min-h-[420px] flex-col" aria-label={`Conversation with ${other}`}>
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        {coachView && <button className="lg:hidden rounded p-1" onClick={() => setActive(null)} aria-label="Back to conversations"><ArrowLeft size={18} /></button>}
        <Avatar name={other} />
        <div className="flex-1"><p className="font-semibold">{other}</p><p className="text-sm text-steel">{coachView ? "Client, Upper / lower, 4 days" : "Your coach, replies within a day"}</p></div>
        <Button size="sm" variant="secondary" title="Opens a call with the video provider"><Video size={16} /> Video call</Button>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {msgs.map((m) => (
          <div key={m.id} className={clsx("flex", m.mine ? "justify-end" : "justify-start")}>
            <div className="max-w-[78%]">
              {m.context && <Link to={coachView ? "/coach/clients/u1" : "/app/workouts"} className="mb-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">On {m.context}</Link>}
              <p className={clsx("rounded-panel px-3 py-2", m.mine ? "bg-iron text-chalk" : "bg-chalk")}>{m.body}</p>
              <p className={clsx("mt-0.5 text-xs text-steel", m.mine && "text-right")}>{m.at}</p>
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
        <button type="button" aria-label="Attach a file" className="rounded p-2 text-steel hover:bg-black/5"><Paperclip size={18} /></button>
        <label htmlFor="msg" className="sr-only">Message</label>
        <input id="msg" className="input flex-1" placeholder={`Message ${other.split(" ")[0]}`} value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit" aria-label="Send" disabled={!text.trim()}><Send size={16} /></Button>
      </form>
    </section>
  );

  if (!coachView) return <div className="mx-auto max-w-3xl">{thread}</div>;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <nav aria-label="Conversations" className={clsx("panel h-fit", active && "hidden lg:block")}>
        <h1 className="border-b border-line px-4 py-3 text-2xl">Messages</h1>
        <ul className="divide-y divide-line">
          {conversations.map((c) => (
            <li key={c.id}><button onClick={() => setActive(c.id)} aria-current={active === c.id}
              className={clsx("flex w-full items-center gap-3 px-4 py-3 text-left", active === c.id ? "bg-chalk" : "hover:bg-black/[0.02]")}>
              <Avatar name={c.name} size={32} />
              <span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><span className="truncate font-semibold">{c.name}</span><span className="text-xs text-steel">{c.at}</span></span>
                <span className="block truncate text-sm text-steel">{c.last}</span></span>
              {c.unread > 0 && <span className="num flex h-5 min-w-5 items-center justify-center rounded-full bg-protein px-1.5 text-xs text-white">{c.unread}</span>}
            </button></li>
          ))}
        </ul>
      </nav>
      {active ? thread : <div className="hidden lg:flex panel items-center justify-center text-steel">Choose a conversation.</div>}
    </div>
  );
}
