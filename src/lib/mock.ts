// Mock data so the UI is usable before the API exists.
// Replace each export with a call in src/lib/api.ts as backend endpoints land.
import type {
  Client, Exercise, Food, MealEntry, Message, Notification, UserProfile, WeightEntry, Workout,
} from "./types";

export const TODAY = "2026-11-04";

export const currentUser: UserProfile = {
  id: "u1",
  name: "Sara Bennani",
  email: "sara@example.com",
  role: "user",
  plan: "free",
  goal: "lose",
  level: "intermediate",
  units: { weight: "kg", length: "cm" },
  timezone: "Africa/Casablanca",
  diet: ["High protein"],
  allergies: ["Peanuts"],
  coachId: "c1",
};

export const goals = { kcal: 1950, protein: 140, carbs: 190, fat: 65, weightKg: 62 };

export const exercises: Exercise[] = [
  { id: "e1", name: "Back squat", primary: "Quads", secondary: ["Glutes", "Core"], equipment: "Barbell", type: "Strength", difficulty: "Intermediate",
    steps: ["Set the bar on your upper back, hands just outside shoulders.", "Brace, then sit down and back until hips pass knee height.", "Drive up through mid-foot, keeping the chest tall."], alternatives: ["e2", "e9"], status: "published" },
  { id: "e2", name: "Goblet squat", primary: "Quads", secondary: ["Glutes"], equipment: "Dumbbell", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Hold a dumbbell vertically against your chest.", "Squat between your knees, elbows inside the thighs.", "Stand up without letting the weight drift forward."], alternatives: ["e1", "e9"], status: "published" },
  { id: "e3", name: "Bench press", primary: "Chest", secondary: ["Triceps", "Shoulders"], equipment: "Barbell", type: "Strength", difficulty: "Intermediate",
    steps: ["Lie with eyes under the bar, shoulder blades pinched.", "Lower the bar to mid-chest with control.", "Press up and slightly back over the shoulders."], alternatives: ["e4", "e10"], status: "published" },
  { id: "e4", name: "Dumbbell bench press", primary: "Chest", secondary: ["Triceps"], equipment: "Dumbbell", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Kick the dumbbells up to your chest as you lie back.", "Press until arms are straight, wrists stacked.", "Lower slowly to chest level."], alternatives: ["e3", "e10"], status: "published" },
  { id: "e5", name: "Romanian deadlift", primary: "Hamstrings", secondary: ["Glutes", "Back"], equipment: "Barbell", type: "Strength", difficulty: "Intermediate",
    steps: ["Stand tall holding the bar at hip height.", "Push hips back with soft knees until you feel the hamstrings stretch.", "Squeeze glutes to return to standing."], alternatives: ["e11"], status: "published" },
  { id: "e6", name: "Lat pulldown", primary: "Back", secondary: ["Biceps"], equipment: "Cable", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Grip the bar wider than shoulders.", "Pull to the upper chest, elbows driving down.", "Return under control until arms are straight."], alternatives: ["e12"], status: "published" },
  { id: "e7", name: "Overhead press", primary: "Shoulders", secondary: ["Triceps", "Core"], equipment: "Barbell", type: "Strength", difficulty: "Intermediate",
    steps: ["Start with the bar on your front shoulders.", "Press straight up, moving your head out of the way.", "Lock out with the bar over mid-foot."], alternatives: ["e13"], status: "published" },
  { id: "e8", name: "Plank", primary: "Core", secondary: ["Shoulders"], equipment: "Bodyweight", type: "Conditioning", difficulty: "Beginner",
    steps: ["Forearms under shoulders, body in one line.", "Brace abs and squeeze glutes.", "Hold without letting the hips sag."], alternatives: [], status: "published" },
  { id: "e9", name: "Leg press", primary: "Quads", secondary: ["Glutes"], equipment: "Machine", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Feet shoulder-width on the platform.", "Lower until knees reach about 90°.", "Press without locking the knees."], alternatives: ["e1", "e2"], status: "published" },
  { id: "e10", name: "Push-up", primary: "Chest", secondary: ["Triceps", "Core"], equipment: "Bodyweight", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Hands slightly wider than shoulders.", "Lower your chest to just above the floor.", "Push back up keeping a straight line."], alternatives: ["e4"], status: "published" },
  { id: "e11", name: "Kettlebell swing", primary: "Glutes", secondary: ["Hamstrings", "Core"], equipment: "Kettlebell", type: "Conditioning", difficulty: "Intermediate",
    steps: ["Hike the bell back between your legs.", "Snap hips forward to float it to chest height.", "Let it fall back and repeat."], alternatives: ["e5"], status: "published" },
  { id: "e12", name: "Band-assisted pull-up", primary: "Back", secondary: ["Biceps"], equipment: "Band", type: "Strength", difficulty: "Beginner",
    steps: ["Loop a band on the bar and place a knee in it.", "Pull until your chin clears the bar.", "Lower all the way down."], alternatives: ["e6"], status: "published" },
  { id: "e13", name: "Seated dumbbell press", primary: "Shoulders", secondary: ["Triceps"], equipment: "Dumbbell", type: "Hypertrophy", difficulty: "Beginner",
    steps: ["Sit upright with dumbbells at shoulder height.", "Press overhead until arms are straight.", "Lower to ear level."], alternatives: ["e7"], status: "draft" },
  { id: "e14", name: "Hip thrust", primary: "Glutes", secondary: ["Hamstrings"], equipment: "Barbell", type: "Hypertrophy", difficulty: "Intermediate",
    steps: ["Upper back on a bench, bar over hips.", "Drive hips up until your body is flat.", "Pause, then lower with control."], alternatives: ["e11"], status: "published" },
];

export const exerciseById = (id: string) => exercises.find((e) => e.id === id);

export const workouts: Workout[] = [
  { id: "w1", name: "Lower A", date: "2026-11-02", status: "done", durationMin: 58, assignedBy: "Coach Youssef",
    exercises: [
      { exerciseId: "e1", restSec: 150, sets: [{ reps: 5, weight: 60 }, { reps: 5, weight: 62.5 }, { reps: 5, weight: 65 }] },
      { exerciseId: "e5", restSec: 120, sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
      { exerciseId: "e14", restSec: 90, sets: [{ reps: 10, weight: 70 }, { reps: 10, weight: 70 }] },
    ] },
  { id: "w2", name: "Upper A", date: "2026-11-04", status: "planned", assignedBy: "Coach Youssef",
    exercises: [
      { exerciseId: "e3", restSec: 150, sets: [{ reps: 5, weight: 40 }, { reps: 5, weight: 40 }, { reps: 5, weight: 42.5 }] },
      { exerciseId: "e6", restSec: 90, sets: [{ reps: 10, weight: 40 }, { reps: 10, weight: 40 }, { reps: 10, weight: 40 }] },
      { exerciseId: "e7", restSec: 120, sets: [{ reps: 6, weight: 27.5 }, { reps: 6, weight: 27.5 }, { reps: 6, weight: 27.5 }] },
      { exerciseId: "e8", restSec: 60, sets: [{ reps: 45, weight: 0 }, { reps: 45, weight: 0 }] },
    ] },
  { id: "w3", name: "Lower B", date: "2026-11-06", status: "planned", assignedBy: "Coach Youssef",
    exercises: [
      { exerciseId: "e9", restSec: 120, sets: [{ reps: 10, weight: 110 }, { reps: 10, weight: 110 }, { reps: 10, weight: 110 }] },
      { exerciseId: "e11", restSec: 60, sets: [{ reps: 15, weight: 16 }, { reps: 15, weight: 16 }, { reps: 15, weight: 16 }] },
    ] },
  { id: "w4", name: "Upper B", date: "2026-11-07", status: "planned",
    exercises: [
      { exerciseId: "e4", restSec: 90, sets: [{ reps: 10, weight: 16 }, { reps: 10, weight: 16 }, { reps: 10, weight: 16 }] },
      { exerciseId: "e12", restSec: 90, sets: [{ reps: 6, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }] },
    ] },
  { id: "w5", name: "Upper B", date: "2026-10-31", status: "done", durationMin: 52,
    exercises: [
      { exerciseId: "e4", restSec: 90, sets: [{ reps: 10, weight: 14 }, { reps: 10, weight: 16 }, { reps: 9, weight: 16 }] },
      { exerciseId: "e12", restSec: 90, sets: [{ reps: 6, weight: 0 }, { reps: 5, weight: 0 }] },
    ] },
  { id: "w6", name: "Upper A", date: "2026-10-30", status: "skipped", exercises: [] },
  { id: "w7", name: "Lower A", date: "2026-10-28", status: "done", durationMin: 61,
    exercises: [{ exerciseId: "e1", restSec: 150, sets: [{ reps: 5, weight: 60 }, { reps: 5, weight: 60 }, { reps: 5, weight: 60 }] }] },
];

export const templates = [
  { id: "t1", name: "Upper / lower, 4 days", level: "Intermediate", weeks: 8, perWeek: 4, focus: "Strength" },
  { id: "t2", name: "Full body, 3 days", level: "Beginner", weeks: 6, perWeek: 3, focus: "General fitness" },
  { id: "t3", name: "Glute & hamstring block", level: "Intermediate", weeks: 6, perWeek: 3, focus: "Hypertrophy" },
  { id: "t4", name: "Bodyweight at home", level: "Beginner", weeks: 4, perWeek: 3, focus: "No equipment" },
];

export const personalRecords = [
  { exerciseId: "e1", value: "65 kg × 5", date: "2026-11-02" },
  { exerciseId: "e3", value: "42.5 kg × 5", date: "2026-10-26" },
  { exerciseId: "e5", value: "55 kg × 8", date: "2026-10-19" },
  { exerciseId: "e12", value: "6 reps", date: "2026-10-31" },
];

export const foods: Food[] = [
  { id: "f1", name: "Rolled oats", per: 100, unit: "g", kcal: 379, protein: 13, carbs: 68, fat: 6.5 },
  { id: "f2", name: "Greek yogurt 2%", brand: "Jaouda", per: 100, unit: "g", kcal: 73, protein: 10, carbs: 3.9, fat: 2 },
  { id: "f3", name: "Banana", per: 100, unit: "g", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: "f4", name: "Chicken breast, grilled", per: 100, unit: "g", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f5", name: "White rice, cooked", per: 100, unit: "g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: "f6", name: "Olive oil", per: 10, unit: "ml", kcal: 88, protein: 0, carbs: 0, fat: 10 },
  { id: "f7", name: "Lentils, cooked", per: 100, unit: "g", kcal: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "f8", name: "Egg, whole", per: 50, unit: "g", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { id: "f9", name: "Whole wheat bread", per: 100, unit: "g", kcal: 247, protein: 13, carbs: 41, fat: 3.4 },
  { id: "f10", name: "Almonds", per: 30, unit: "g", kcal: 173, protein: 6.3, carbs: 6.5, fat: 15 },
  { id: "f11", name: "Salmon fillet", per: 100, unit: "g", kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "f12", name: "Whey protein", brand: "Generic", per: 30, unit: "g", kcal: 120, protein: 24, carbs: 3, fat: 1.5 },
  { id: "f13", name: "Harira (homemade)", per: 250, unit: "ml", kcal: 210, protein: 11, carbs: 30, fat: 5, custom: true },
];
export const foodById = (id: string) => foods.find((f) => f.id === id)!;

export const mealLog: MealEntry[] = [
  { id: "m1", foodId: "f1", slot: "Breakfast", qty: 60 },
  { id: "m2", foodId: "f2", slot: "Breakfast", qty: 170 },
  { id: "m3", foodId: "f3", slot: "Breakfast", qty: 110 },
  { id: "m4", foodId: "f4", slot: "Lunch", qty: 180 },
  { id: "m5", foodId: "f5", slot: "Lunch", qty: 200 },
  { id: "m6", foodId: "f6", slot: "Lunch", qty: 10 },
  { id: "m7", foodId: "f10", slot: "Snacks", qty: 30 },
];

export const weightLog: WeightEntry[] = [
  { date: "2026-09-08", kg: 68.4 }, { date: "2026-09-15", kg: 68.0 }, { date: "2026-09-22", kg: 67.7 },
  { date: "2026-09-29", kg: 67.9 }, { date: "2026-10-06", kg: 67.1 }, { date: "2026-10-13", kg: 66.8 },
  { date: "2026-10-20", kg: 66.6 }, { date: "2026-10-24", kg: 66.2 }, { date: "2026-10-27", kg: 66.3 },
  { date: "2026-10-30", kg: 65.9 }, { date: "2026-11-02", kg: 65.6 }, { date: "2026-11-04", kg: 65.4 },
];

export const measurements = [
  { label: "Waist", unit: "cm", start: 78, now: 74.5 },
  { label: "Hips", unit: "cm", start: 101, now: 99 },
  { label: "Thigh", unit: "cm", start: 58, now: 57 },
  { label: "Arm", unit: "cm", start: 29, now: 29.5 },
];

export const clients: Client[] = [
  { id: "u1", name: "Sara Bennani", goal: "Lose 4 kg", adherence: 86, lastActive: "Today", weightTrend: -1.2, status: "on-track", plan: "free", program: "Upper / lower, 4 days", sharing: { weight: true, workouts: true, nutrition: true } },
  { id: "u2", name: "Omar El Idrissi", goal: "First pull-up", adherence: 54, lastActive: "4 days ago", weightTrend: 0.3, status: "needs-attention", plan: "premium", program: "Full body, 3 days", sharing: { weight: true, workouts: true, nutrition: false } },
  { id: "u3", name: "Lina Haddad", goal: "Squat 80 kg", adherence: 92, lastActive: "Yesterday", weightTrend: 0.6, status: "on-track", plan: "premium", program: "Glute & hamstring block", sharing: { weight: false, workouts: true, nutrition: true } },
  { id: "u4", name: "Mehdi Tazi", goal: "Lose 8 kg", adherence: 31, lastActive: "9 days ago", weightTrend: 0.4, status: "needs-attention", plan: "premium", program: "Upper / lower, 4 days", sharing: { weight: true, workouts: true, nutrition: true } },
  { id: "u5", name: "Nadia Ouali", goal: "Run 10 km", adherence: 0, lastActive: "Joined today", weightTrend: 0, status: "new", plan: "free", program: "Not assigned", sharing: { weight: true, workouts: true, nutrition: false } },
];

export const coachRequests = [
  { id: "r1", name: "Karim Alaoui", goal: "Build muscle, 3 sessions a week", level: "Beginner", sent: "2 hours ago", message: "Training at home with dumbbells only." },
  { id: "r2", name: "Imane Saidi", goal: "Get back into running after an injury", level: "Intermediate", sent: "Yesterday", message: "I'd like weekly check-ins if possible." },
];

export const coaches = [
  { id: "c1", name: "Youssef Amrani", specialty: "Strength & fat loss", clients: 18, rating: 4.9, slots: "Mon, Wed, Fri evenings" },
  { id: "c2", name: "Hind Berrada", specialty: "Running & endurance", clients: 12, rating: 4.8, slots: "Weekend mornings" },
  { id: "c3", name: "Adam Fassi", specialty: "Beginners & mobility", clients: 9, rating: 4.7, slots: "Tue, Thu lunchtime" },
];

export const messages: Message[] = [
  { id: "1", from: "Youssef Amrani", body: "Nice work on Monday's squats. Bar speed looked good on the last set.", at: "Mon 19:02", context: "Lower A · 2 Nov" },
  { id: "2", from: "Sara Bennani", body: "Thanks! Knees felt a bit tight on the third set though.", at: "Mon 19:15", mine: true },
  { id: "3", from: "Youssef Amrani", body: "Add the 5-minute hip mobility warm-up before Lower B. I've put it in the program.", at: "Mon 19:20" },
  { id: "4", from: "Youssef Amrani", body: "Reminder: Upper A today. Try 42.5 kg on the last bench set if the first two move well.", at: "08:30", context: "Upper A · 4 Nov" },
];

export const conversations = [
  { id: "u1", name: "Sara Bennani", last: "Thanks! Knees felt a bit tight…", at: "Mon", unread: 0 },
  { id: "u2", name: "Omar El Idrissi", last: "Missed Thursday, work trip.", at: "Sun", unread: 2 },
  { id: "u3", name: "Lina Haddad", last: "New squat PR video attached", at: "Sat", unread: 1 },
];

export const notifications: Notification[] = [
  { id: "n1", kind: "reminder", title: "Upper A is planned for today", body: "4 exercises, about 55 minutes.", at: "08:00", read: false },
  { id: "n2", kind: "message", title: "New message from Youssef", body: "Reminder: Upper A today. Try 42.5 kg on…", at: "08:30", read: false },
  { id: "n3", kind: "program", title: "Your program was updated", body: "Hip mobility warm-up added to Lower B.", at: "Mon 19:20", read: true },
  { id: "n4", kind: "system", title: "New personal record", body: "Back squat 65 kg × 5.", at: "Mon 18:40", read: true },
];

export const adminStats = {
  users: 2418, activeWeekly: 1163, premium: 312, coaches: 24,
  signups: [
    { d: "29 Oct", v: 31 }, { d: "30 Oct", v: 44 }, { d: "31 Oct", v: 38 }, { d: "1 Nov", v: 22 },
    { d: "2 Nov", v: 27 }, { d: "3 Nov", v: 52 }, { d: "4 Nov", v: 19 },
  ],
  apiP95: 184, errorRate: 0.4,
};

export const adminUsers = [
  { id: "u1", name: "Sara Bennani", email: "sara@example.com", role: "user", plan: "free", status: "active", joined: "2026-08-12" },
  { id: "u2", name: "Omar El Idrissi", email: "omar@example.com", role: "user", plan: "premium", status: "active", joined: "2026-07-03" },
  { id: "c1", name: "Youssef Amrani", email: "youssef@example.com", role: "coach", plan: "premium", status: "active", joined: "2026-05-20" },
  { id: "u6", name: "Test Account 17", email: "spam17@mailinator.com", role: "user", plan: "free", status: "suspended", joined: "2026-10-29" },
  { id: "a1", name: "Admin Ops", email: "ops@example.com", role: "admin", plan: "premium", status: "active", joined: "2026-04-01" },
  { id: "u4", name: "Mehdi Tazi", email: "mehdi@example.com", role: "user", plan: "premium", status: "active", joined: "2026-09-14" },
] as const;

export const auditLog = [
  { at: "2026-11-04 09:12", actor: "ops@example.com", action: "user.suspend", target: "spam17@mailinator.com", ip: "10.0.4.21" },
  { at: "2026-11-04 08:47", actor: "ops@example.com", action: "exercise.publish", target: "Hip thrust", ip: "10.0.4.21" },
  { at: "2026-11-03 17:30", actor: "youssef@example.com", action: "program.update", target: "Sara Bennani / Upper-lower", ip: "41.250.12.8" },
  { at: "2026-11-03 11:02", actor: "ops@example.com", action: "role.grant", target: "hind@example.com → coach", ip: "10.0.4.21" },
  { at: "2026-11-02 22:15", actor: "system", action: "subscription.expire", target: "karim@example.com", ip: "—" },
];

export const reports = [
  { id: "rp1", kind: "Food entry", target: "“Protein bar XL” — 20 kcal per 100 g", by: "lina@example.com", at: "Today", status: "open" },
  { id: "rp2", kind: "Message", target: "Spam link in coach chat", by: "omar@example.com", at: "Yesterday", status: "open" },
  { id: "rp3", kind: "Exercise", target: "Video for Kettlebell swing shows wrong form", by: "youssef@example.com", at: "2 Nov", status: "resolved" },
];

export const services = [
  { name: "Web app", status: "operational" },
  { name: "API (Spring Boot)", status: "operational" },
  { name: "Database (PostgreSQL)", status: "operational" },
  { name: "Media storage", status: "degraded", note: "Progress photo uploads are slower than usual. Uploads still complete." },
  { name: "Notifications", status: "operational" },
] as const;
