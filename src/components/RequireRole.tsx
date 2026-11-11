// Route guard (FIT-026). Hides pages a role cannot use and redirects cleanly.
// UX only: the API must enforce the same rules (FIT-022 / FIT-073).
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { homeFor, useAuth } from "../lib/auth";
import type { Role } from "../lib/types";

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { session } = useAuth();
  const loc = useLocation();
  if (!session) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (session.role === "user" && !session.onboarded) return <Navigate to="/onboarding" replace />;
  if (!roles.includes(session.role)) return <Navigate to={homeFor(session.role)} replace />;
  return <>{children}</>;
}
