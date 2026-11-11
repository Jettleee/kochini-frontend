// FIT-019 registration with clear, field-level errors
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../lib/auth";
import { AuthLayout, GoogleButton } from "./AuthLayout";

type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

export function Register() {
  const { login, update } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Enter the name you want your coach to see.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter an email address like name@example.com.";
    if (f.password.length < 8) e.password = "Use at least 8 characters.";
    else if (!/\d/.test(f.password)) e.password = "Add at least one number.";
    if (!f.terms) e.terms = "Accept the terms to create your account.";
    return e;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    // Replace with POST /api/auth/register. 409 → errors.email = "An account already uses this email."
    login(f.email, "user");
    update({ name: f.name, onboarded: false });
    nav("/onboarding");
  }

  const strength = Math.min(3, [f.password.length >= 8, /\d/.test(f.password), /[^A-Za-z0-9]/.test(f.password) || f.password.length >= 12].filter(Boolean).length);

  return (
    <AuthLayout title="Create your account" sub="Free to start. Upgrade only if you want coaching extras." footer={<>Already have an account? <Link to="/login" className="link">Log in</Link></>}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name" error={errors.name}>{(id, d) => <Input id={id} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={d} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}</Field>
        <Field label="Email" error={errors.email}>{(id, d) => <Input id={id} type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={d} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />}</Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters, including a number.">
          {(id, d) => (
            <>
              <Input id={id} type="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby={d} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
              <div className="flex gap-1 pt-1" aria-hidden>
                {[0, 1, 2].map((i) => <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < strength ? ["var(--plate-red)", "var(--plate-yellow)", "var(--plate-green)"][strength - 1] : "var(--line)" }} />)}
              </div>
            </>
          )}
        </Field>
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--plate-blue)]" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} aria-invalid={!!errors.terms} />
            <span>I accept the <a href="#" className="link">terms</a> and the <a href="#" className="link">privacy policy</a>.</span>
          </label>
          {errors.terms && <p className="mt-1 text-sm text-danger">{errors.terms}</p>}
        </div>
        <Button type="submit" className="w-full">Create account</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-sm text-steel"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <GoogleButton label="Sign up with Google" onClick={() => { login("", "user"); update({ onboarded: false }); nav("/onboarding"); }} />
    </AuthLayout>
  );
}
