import clsx from "clsx";
import {
  Activity, Bell, CalendarDays, ClipboardList, Dumbbell, Flag, Gauge, Inbox, LayoutGrid, LogOut, Menu,
  MessageSquare, Salad, ScrollText, Settings, ShieldCheck, Sparkles, TrendingDown, UserPlus, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { homeFor, useAuth } from "../lib/auth";
import { notifications } from "../lib/mock";
import type { Role } from "../lib/types";
import { Logo } from "./Logo";
import { Avatar } from "./ui";

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean };
const NAV: Record<Role, Item[]> = {
  user: [
    { to: "/app", label: "Today", icon: Gauge, end: true },
    { to: "/app/workouts", label: "Workouts", icon: CalendarDays },
    { to: "/app/exercises", label: "Exercises", icon: Dumbbell },
    { to: "/app/nutrition", label: "Nutrition", icon: Salad },
    { to: "/app/progress", label: "Progress", icon: TrendingDown },
    { to: "/app/messages", label: "Coach", icon: MessageSquare },
    { to: "/app/premium", label: "Premium", icon: Sparkles },
  ],
  coach: [
    { to: "/coach", label: "Clients", icon: Users, end: true },
    { to: "/coach/requests", label: "Requests", icon: UserPlus },
    { to: "/coach/programs", label: "Programs", icon: ClipboardList },
    { to: "/coach/schedule", label: "Schedule", icon: CalendarDays },
    { to: "/coach/messages", label: "Messages", icon: MessageSquare },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/admin/users", label: "Users & roles", icon: Users },
    { to: "/admin/content", label: "Content", icon: Dumbbell },
    { to: "/admin/reports", label: "Reports", icon: Flag },
    { to: "/admin/audit", label: "Audit log", icon: ScrollText },
    { to: "/status", label: "Service status", icon: Activity },
  ],
};

export function AppShell() {
  const { session, logout, login } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  useEffect(() => setOpen(false), [loc.pathname]);
  if (!session) return null;
  const role = session.role;
  const unread = notifications.filter((n) => !n.read).length;
  const bellTo = role === "user" ? "/app/notifications" : role === "coach" ? "/coach/messages" : "/admin/reports";

  const sidebar = (
    <nav aria-label="Main" className="flex h-full flex-col bg-iron px-3 py-4 text-chalk">
      <div className="flex items-center justify-between px-2 pb-6">
        <Logo tone="light" />
        <button className="lg:hidden rounded p-1 text-chalk/70 hover:text-chalk" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
      </div>
      <ul className="space-y-0.5">
        {NAV[role].map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 rounded-[4px] px-3 py-2 text-[15px] font-medium",
                isActive ? "bg-chalk text-iron" : "text-chalk/75 hover:bg-white/5 hover:text-chalk",
              )}
            >
              <Icon size={18} />{label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
        <label className="block px-2 text-xs text-chalk/60" htmlFor="role-switch">Demo: view as</label>
        <select
          id="role-switch"
          value={role}
          onChange={(e) => { const r = e.target.value as Role; login("", r); nav(homeFor(r)); }}
          className="w-full rounded-[4px] border border-white/15 bg-iron-soft px-2 py-1.5 text-sm text-chalk"
        >
          <option value="user">Athlete (Sara)</option>
          <option value="coach">Coach (Youssef)</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex items-center gap-3 px-2">
          <Avatar name={session.name} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{session.name}</p>
            <p className="truncate text-xs text-chalk/60">{role === "user" ? (session.plan === "premium" ? "Premium" : "Free plan") : role === "coach" ? "Coach" : "Administrator"}</p>
          </div>
          <NavLink to="/settings" aria-label="Settings" className="rounded p-1 text-chalk/70 hover:text-chalk"><Settings size={18} /></NavLink>
          <button onClick={() => { logout(); nav("/login"); }} aria-label="Log out" className="rounded p-1 text-chalk/70 hover:text-chalk"><LogOut size={18} /></button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-iron/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[264px]">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-chalk/95 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden -ml-1 rounded p-1" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Logo size="sm" className="lg:hidden" />
          <div className="ml-auto flex items-center gap-1">
            {role === "admin" && <span className="mr-2 hidden items-center gap-1 text-sm text-steel sm:flex"><ShieldCheck size={16} /> Admin session</span>}
            {role === "coach" && <NavLink to="/coach/requests" className="mr-1 hidden items-center gap-1 text-sm text-steel hover:text-ink sm:flex"><Inbox size={16} /> 2 new requests</NavLink>}
            <NavLink to={bellTo} aria-label={`Notifications, ${unread} unread`} className="relative rounded p-2 hover:bg-black/5">
              <Bell size={20} />
              {unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-protein" />}
            </NavLink>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-[1180px] px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
