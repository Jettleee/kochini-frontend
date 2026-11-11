import { Link } from "react-router-dom";
import { useAuth, homeFor } from "../lib/auth";

export function NotFound() {
  const { session } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="num text-7xl">404</p>
      <h1>This page doesn't exist</h1>
      <p className="text-steel">Check the address, or go back to where you were.</p>
      <Link to={session ? homeFor(session.role) : "/login"} className="link">Go to {session ? "your home page" : "log in"}</Link>
    </main>
  );
}
