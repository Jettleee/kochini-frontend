// FIT-030 profile & photo, FIT-031 units & diet, FIT-032 allergies, FIT-034 timezone,
// FIT-095 reminders, FIT-097 notification channels, FIT-067 data export, coach sharing (EP10)
import { Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Chip, Field, Input, PageHeader, Panel, Select, Tabs, Toggle } from "../../components/ui";
import { useAuth } from "../../lib/auth";
import { currentUser } from "../../lib/mock";

type Tab = "profile" | "prefs" | "notifs" | "privacy";
const ALLERGENS = ["Peanuts", "Tree nuts", "Gluten", "Lactose", "Eggs", "Fish", "Shellfish", "Soy"];
const DIETS = ["High protein", "Vegetarian", "Vegan", "Halal", "Low carb"];

export function Settings() {
  const { session, update } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState(session?.name ?? "");
  const [saved, setSaved] = useState(false);
  const [p, setP] = useState({ ...currentUser });
  const [n, setN] = useState({ inApp: true, email: true, push: false, reminders: true, reminderTime: "07:30", coach: true, weekly: true });
  const [share, setShare] = useState({ weight: true, workouts: true, nutrition: true, photos: false });
  const isUser = session?.role === "user";
  const toggleList = (k: "diet" | "allergies", v: string) => setP((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const save = () => { update({ name }); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" />
      <Tabs label="Settings sections" value={tab} onChange={setTab} items={[
        { value: "profile", label: "Profile" },
        ...(isUser ? [{ value: "prefs" as Tab, label: "Units & food" }] : []),
        { value: "notifs", label: "Notifications" },
        ...(isUser ? [{ value: "privacy" as Tab, label: "Privacy & data" }] : []),
      ]} />
      <div className="mt-6 space-y-6">
        {tab === "profile" && (
          <Panel>
            <div className="flex items-center gap-4">
              <Avatar name={name || "?"} size={64} />
              <div className="flex gap-2"><Button size="sm" variant="secondary">Upload photo</Button><Button size="sm" variant="ghost">Remove</Button></div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Display name" hint="Shown to your coach.">{(id, d) => <Input id={id} aria-describedby={d} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
              <Field label="Email">{(id) => <Input id={id} type="email" defaultValue={session?.email} />}</Field>
              <Field label="Time zone" hint="Diary days start at midnight in this zone.">{(id, d) => (
                <Select id={id} aria-describedby={d} value={p.timezone} onChange={(e) => setP({ ...p, timezone: e.target.value })}>
                  {["Africa/Casablanca", "Europe/Paris", "Europe/London", "America/New_York", "Asia/Dubai"].map((z) => <option key={z}>{z}</option>)}
                </Select>
              )}</Field>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-4"><Button onClick={save}>Save changes</Button>{saved && <span role="status" className="text-sm text-fat">Changes saved</span>}</div>
          </Panel>
        )}

        {tab === "prefs" && (
          <Panel>
            <div className="grid gap-6 sm:grid-cols-2">
              <fieldset><legend className="font-semibold">Weight</legend><div className="mt-2 flex gap-2">{(["kg", "lb"] as const).map((u) => <Chip key={u} active={p.units.weight === u} onClick={() => setP({ ...p, units: { ...p.units, weight: u } })}>{u}</Chip>)}</div></fieldset>
              <fieldset><legend className="font-semibold">Length</legend><div className="mt-2 flex gap-2">{(["cm", "in"] as const).map((u) => <Chip key={u} active={p.units.length === u} onClick={() => setP({ ...p, units: { ...p.units, length: u } })}>{u}</Chip>)}</div></fieldset>
            </div>
            <fieldset className="mt-6"><legend className="font-semibold">Diet</legend><div className="mt-2 flex flex-wrap gap-2">{DIETS.map((d) => <Chip key={d} active={p.diet.includes(d)} onClick={() => toggleList("diet", d)}>{d}</Chip>)}</div></fieldset>
            <fieldset className="mt-6"><legend className="font-semibold">Allergies and intolerances</legend>
              <p className="text-sm text-steel">Foods containing these are hidden from suggestions and flagged in search.</p>
              <div className="mt-2 flex flex-wrap gap-2">{ALLERGENS.map((d) => <Chip key={d} active={p.allergies.includes(d)} onClick={() => toggleList("allergies", d)}>{d}</Chip>)}</div>
            </fieldset>
            <div className="mt-6 border-t border-line pt-4"><Button onClick={save}>Save preferences</Button>{saved && <span role="status" className="ml-3 text-sm text-fat">Preferences saved</span>}</div>
          </Panel>
        )}

        {tab === "notifs" && (
          <>
            <Panel title="Where we notify you" bodyClass="py-1 divide-y divide-line">
              <Toggle label="In the app" checked={n.inApp} onChange={(v) => setN({ ...n, inApp: v })} />
              <Toggle label="Email" checked={n.email} onChange={(v) => setN({ ...n, email: v })} />
              <Toggle label="Push on this device" description="Your browser will ask for permission." checked={n.push} onChange={(v) => setN({ ...n, push: v })} />
            </Panel>
            <Panel title="What we notify you about" bodyClass="py-1 divide-y divide-line">
              {isUser && <Toggle label="Workout reminders" description="On days with a planned workout." checked={n.reminders} onChange={(v) => setN({ ...n, reminders: v })} />}
              {isUser && n.reminders && (
                <div className="flex items-center justify-between py-3"><label htmlFor="rt" className="font-semibold">Reminder time</label><Input id="rt" type="time" className="w-32" value={n.reminderTime} onChange={(e) => setN({ ...n, reminderTime: e.target.value })} /></div>
              )}
              <Toggle label={isUser ? "Messages and program changes from your coach" : "New messages and client requests"} checked={n.coach} onChange={(v) => setN({ ...n, coach: v })} />
              <Toggle label="Weekly summary" checked={n.weekly} onChange={(v) => setN({ ...n, weekly: v })} />
            </Panel>
          </>
        )}

        {tab === "privacy" && (
          <>
            <Panel title="What your coach can see" bodyClass="py-1 divide-y divide-line">
              <Toggle label="Weight and measurements" checked={share.weight} onChange={(v) => setShare({ ...share, weight: v })} />
              <Toggle label="Workouts" checked={share.workouts} onChange={(v) => setShare({ ...share, workouts: v })} />
              <Toggle label="Food diary" checked={share.nutrition} onChange={(v) => setShare({ ...share, nutrition: v })} />
              <Toggle label="Progress photos" checked={share.photos} onChange={(v) => setShare({ ...share, photos: v })} />
              <p className="py-3 text-sm text-steel">Coach: Youssef Amrani. <Link to="/app/coaches" className="link">Find a different coach</Link></p>
            </Panel>
            <Panel title="Your data">
              <p className="text-steel">Download everything you've logged: profile, workouts, food diary, weight and measurements.</p>
              <div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary"><Download size={16} /> Export as JSON</Button><Button variant="secondary"><Download size={16} /> Export as CSV</Button></div>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-semibold">Delete account</p>
                <p className="text-sm text-steel">Removes your account and all logged data after 30 days. You can cancel during that time.</p>
                <Button variant="danger" className="mt-3">Delete my account</Button>
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}
