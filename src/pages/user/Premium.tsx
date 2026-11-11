// FIT-071 paywall and plan comparison. Payment provider is out of MVP scope.
import { Check, Minus } from "lucide-react";
import { useState } from "react";
import { Button, Chip, PageHeader } from "../../components/ui";
import { useAuth } from "../../lib/auth";

const ROWS: [string, boolean | string, boolean | string][] = [
  ["Workout logging and history", true, true],
  ["Exercise library", true, true],
  ["Food diary and macros", true, true],
  ["Weight and measurement tracking", true, true],
  ["Program templates", "4 basic", "All, plus custom"],
  ["Personalized training and nutrition plan", false, true],
  ["Coach assignment and chat", false, true],
  ["Coach feedback on sessions", false, true],
  ["Progress photos", "3 photos", "Unlimited"],
  ["Data export (CSV)", true, true],
];

const Cell = ({ v }: { v: boolean | string }) =>
  v === true ? <Check size={18} className="text-fat" aria-label="Included" /> : v === false ? <Minus size={18} className="text-steel/60" aria-label="Not included" /> : <span className="text-sm">{v}</span>;

export function Premium() {
  const { session, update } = useAuth();
  const [yearly, setYearly] = useState(true);
  const premium = session?.plan === "premium";
  return (
    <div className="max-w-4xl">
      <PageHeader title="Premium" sub="Free covers logging. Premium adds a coach and a plan built around you." />
      <div className="mb-6 flex gap-2"><Chip active={!yearly} onClick={() => setYearly(false)}>Monthly</Chip><Chip active={yearly} onClick={() => setYearly(true)}>Yearly, save 25%</Chip></div>

      <div className="overflow-x-auto panel">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-line align-bottom">
              <th scope="col" className="w-1/2 p-4"><span className="sr-only">Feature</span></th>
              <th scope="col" className="p-4">
                <p className="font-display text-2xl font-bold">Free</p>
                <p className="num text-3xl">0 <span className="font-sans text-sm font-normal text-steel">MAD</span></p>
                <p className="mt-2 text-sm text-steel">{premium ? "" : "Your current plan"}</p>
              </th>
              <th scope="col" className="border-l-4 border-brand bg-brand-soft/60 p-4">
                <p className="font-display text-2xl font-bold">Premium</p>
                <p className="num text-3xl">{yearly ? 74 : 99} <span className="font-sans text-sm font-normal text-steel">MAD / month</span></p>
                <p className="text-sm text-steel">{yearly ? "Billed 888 MAD yearly" : "Cancel any time"}</p>
                <Button className="mt-3 w-full" disabled={premium} onClick={() => update({ plan: "premium" })}>{premium ? "Your plan" : "Upgrade to Premium"}</Button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map(([f, a, b]) => (
              <tr key={f}><th scope="row" className="px-4 py-3 font-medium">{f}</th><td className="px-4 py-3"><Cell v={a} /></td><td className="border-l-4 border-brand bg-brand-soft/60 px-4 py-3"><Cell v={b} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-steel">Online payment is not connected yet. In this build, upgrading switches your account to Premium for testing.</p>
    </div>
  );
}
