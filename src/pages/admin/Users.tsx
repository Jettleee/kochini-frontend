// FIT-099 search, suspend and reactivate accounts; manage roles
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Input, Modal, PageHeader, Select, Table } from "../../components/ui";
import { adminUsers } from "../../lib/mock";

type U = { id: string; name: string; email: string; role: string; plan: string; status: string; joined: string };

export function Users() {
  const [list, setList] = useState<U[]>(adminUsers.map((u) => ({ ...u })));
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [confirm, setConfirm] = useState<U | null>(null);
  const [reason, setReason] = useState("");
  const shown = list.filter((u) => (!role || u.role === role) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  const apply = () => {
    if (!confirm) return;
    setList((l) => l.map((u) => u.id === confirm.id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
    setConfirm(null); setReason("");
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Users & roles" sub="Every change here is written to the audit log." />
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <Input aria-label="Search by name or email" placeholder="Search by name or email" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select aria-label="Role" className="w-auto" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option value="user">Athlete</option><option value="coach">Coach</option><option value="admin">Admin</option></Select>
      </div>
      <div className="panel">
        <Table head={["Name", "Role", "Plan", "Joined", "Status", ""]}>
          {shown.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3"><p className="font-semibold">{u.name}</p><p className="text-sm text-steel">{u.email}</p></td>
              <td className="px-4 py-3">
                <Select aria-label={`Role for ${u.name}`} className="h-8 w-auto py-0 text-sm" value={u.role} onChange={(e) => setList((l) => l.map((x) => x.id === u.id ? { ...x, role: e.target.value } : x))}>
                  <option value="user">Athlete</option><option value="coach">Coach</option><option value="admin">Admin</option>
                </Select>
              </td>
              <td className="px-4 py-3 text-sm capitalize">{u.plan}</td>
              <td className="px-4 py-3 text-sm text-steel tabular-nums">{u.joined}</td>
              <td className="px-4 py-3"><Badge tone={u.status === "active" ? "green" : "red"}>{u.status === "active" ? "Active" : "Suspended"}</Badge></td>
              <td className="px-4 py-3 text-right">
                <Button size="sm" variant={u.status === "active" ? "danger" : "secondary"} onClick={() => setConfirm(u)}>{u.status === "active" ? "Suspend" : "Reactivate"}</Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.status === "active" ? `Suspend ${confirm?.name}?` : `Reactivate ${confirm?.name}?`}>
        <p className="text-steel">{confirm?.status === "active" ? "They'll be logged out and can't sign in until reactivated. Their data is kept." : "They'll be able to sign in again right away."}</p>
        <label htmlFor="reason" className="mt-4 block text-sm font-semibold">Reason (saved to the audit log)</label>
        <textarea id="reason" rows={3} className="input mt-1.5" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
          <Button variant={confirm?.status === "active" ? "danger" : "primary"} disabled={!reason.trim()} onClick={apply}>{confirm?.status === "active" ? "Suspend account" : "Reactivate account"}</Button></div>
      </Modal>
    </div>
  );
}
