// Client-side session for the demo (FIT-020 / FIT-026).
// The real app must trust the role returned by the backend (JWT claims), never this local state.
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Plan, Role } from "./types";

interface Session { name: string; email: string; role: Role; plan: Plan; onboarded: boolean }
interface AuthCtx {
  session: Session | null;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  update: (patch: Partial<Session>) => void;
}

const KEY = "kochini.session";
const DEMO: Record<Role, Omit<Session, "role">> = {
  user: { name: "Sara Bennani", email: "sara@example.com", plan: "free", onboarded: true },
  coach: { name: "Youssef Amrani", email: "youssef@example.com", plan: "premium", onboarded: true },
  admin: { name: "Admin Ops", email: "ops@example.com", plan: "premium", onboarded: true },
};

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function write(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: session lives in memory only */
  }
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(read);
  const value = useMemo<AuthCtx>(() => ({
    session,
    login: (email, role = "user") => {
      const s = { ...DEMO[role], email: email || DEMO[role].email, role };
      setSession(s); write(s);
    },
    logout: () => { setSession(null); write(null); },
    update: (patch) => setSession((prev) => {
      const s = prev ? { ...prev, ...patch } : prev;
      write(s); return s;
    }),
  }), [session]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

export const homeFor = (role: Role) => (role === "coach" ? "/coach" : role === "admin" ? "/admin" : "/app");
