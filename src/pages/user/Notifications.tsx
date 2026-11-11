// FIT-093 in-app notifications
import clsx from "clsx";
import { Bell, ClipboardList, MessageSquare, Trophy } from "lucide-react";
import { useState } from "react";
import { Button, Empty, PageHeader } from "../../components/ui";
import { notifications } from "../../lib/mock";

const ICON = { program: ClipboardList, message: MessageSquare, reminder: Bell, system: Trophy };

export function Notifications() {
  const [list, setList] = useState(notifications);
  return (
    <div className="max-w-2xl">
      <PageHeader title="Notifications" actions={<Button variant="secondary" size="sm" onClick={() => setList(list.map((n) => ({ ...n, read: true })))} disabled={list.every((n) => n.read)}>Mark all as read</Button>} />
      {list.length === 0 ? <Empty title="You're all caught up" body="Program changes, coach messages and workout reminders show up here." /> : (
        <ul className="panel divide-y divide-line">
          {list.map((n) => { const I = ICON[n.kind]; return (
            <li key={n.id} className={clsx("flex gap-3 px-4 py-3", !n.read && "bg-brand-soft/40")}>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chalk"><I size={16} /></span>
              <div className="flex-1"><p className={clsx(!n.read && "font-semibold")}>{n.title}</p><p className="text-sm text-steel">{n.body}</p></div>
              <span className="text-xs text-steel">{n.at}</span>
              {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
            </li>
          ); })}
        </ul>
      )}
    </div>
  );
}
