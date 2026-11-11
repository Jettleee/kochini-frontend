// FIT-021 password recovery
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button, Field, Input } from "../../components/ui";
import { AuthLayout } from "./AuthLayout";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter the email you signed up with."); return; }
    setError(undefined);
    setSent(true); // POST /api/auth/password-reset — always 202 so accounts can't be enumerated
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" sub={`If an account exists for ${email}, we've sent a reset link. It expires in 30 minutes.`} footer={<Link to="/login" className="link">Back to log in</Link>}>
        <Button variant="secondary" onClick={() => setSent(false)}>Use a different email</Button>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title="Reset your password" sub="Enter your email and we'll send you a link to choose a new password." footer={<Link to="/login" className="link">Back to log in</Link>}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" error={error}>{(id, d) => <Input id={id} type="email" autoComplete="email" aria-invalid={!!error} aria-describedby={d} value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}
