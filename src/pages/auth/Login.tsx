// FIT-020 login / FIT-183 Google sign-in (optional)
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Field, Input } from "../../components/ui";
import { homeFor, useAuth } from "../../lib/auth";
import type { Role } from "../../lib/types";
import { AuthLayout, GoogleButton } from "./AuthLayout";

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = (role: Role, mail = email) => { login(mail, role); nav(from ?? homeFor(role), { replace: true }); };

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Enter your email and password."); return; }
    setBusy(true);
    // Replace with POST /api/auth/login. 401 → "Email or password is incorrect."
    setTimeout(() => {
      setBusy(false);
      if (password.length < 6) setError("Email or password is incorrect. Check both and try again.");
      else go(email.includes("coach") ? "coach" : email.includes("admin") ? "admin" : "user");
    }, 400);
  }

  return (
    <AuthLayout
      title="Log in"
      sub="Welcome back. Pick up where you left off."
      footer={<>New to KOCHINI? <Link to="/register" className="link">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <p role="alert" className="rounded-[4px] border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p>}
        <Field label="Email">{(id) => <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
        <Field label="Password">{(id) => <Input id={id} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}</Field>
        <div className="flex justify-end"><Link to="/forgot-password" className="link text-sm">Forgot password?</Link></div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-sm text-steel"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <GoogleButton label="Continue with Google" onClick={() => go("user", "sara@example.com")} />

      <div className="mt-8 rounded-panel border border-dashed border-line p-4">
        <p className="text-sm font-semibold">Demo accounts</p>
        <p className="text-sm text-steel">No backend yet. Jump straight in as:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => go("user", "sara@example.com")}>Athlete</Button>
          <Button size="sm" variant="secondary" onClick={() => go("coach", "youssef@example.com")}>Coach</Button>
          <Button size="sm" variant="secondary" onClick={() => go("admin", "ops@example.com")}>Admin</Button>
        </div>
      </div>
    </AuthLayout>
  );
}
