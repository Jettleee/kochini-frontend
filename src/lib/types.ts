// Domain types, mirroring the relational model in FIT-013.
// Keep these in sync with the Spring Boot DTOs once the OpenAPI spec (FIT-012) is published.

export type Role = "user" | "coach" | "admin";
export type Plan = "free" | "premium";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  goal: "lose" | "maintain" | "gain" | "strength";
  level: "beginner" | "intermediate" | "advanced";
  units: { weight: "kg" | "lb"; length: "cm" | "in" };
  timezone: string;
  diet: string[];
  allergies: string[];
  coachId?: string;
}

export type Muscle =
  | "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps"
  | "Quads" | "Hamstrings" | "Glutes" | "Calves" | "Core";
export type Equipment = "Barbell" | "Dumbbell" | "Machine" | "Cable" | "Bodyweight" | "Kettlebell" | "Band";

export interface Exercise {
  id: string;
  name: string;
  primary: Muscle;
  secondary: Muscle[];
  equipment: Equipment;
  type: "Strength" | "Hypertrophy" | "Conditioning" | "Mobility";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  steps: string[];
  alternatives: string[];
  status?: "published" | "draft" | "archived";
}

export interface WorkoutSet { reps: number; weight: number; rpe?: number; done?: boolean }
export interface WorkoutExercise { exerciseId: string; sets: WorkoutSet[]; restSec: number; note?: string }
export interface Workout {
  id: string;
  name: string;
  date: string; // ISO date in the user's local timezone (FIT-034)
  status: "planned" | "done" | "skipped";
  durationMin?: number;
  exercises: WorkoutExercise[];
  assignedBy?: string; // coach name, when coach-assigned
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  per: number; // grams per portion reference
  unit: "g" | "ml";
  kcal: number; protein: number; carbs: number; fat: number;
  custom?: boolean;
}
export type MealSlot = "Breakfast" | "Lunch" | "Dinner" | "Snacks";
export interface MealEntry { id: string; foodId: string; slot: MealSlot; qty: number }

export interface WeightEntry { date: string; kg: number }

export interface Client {
  id: string;
  name: string;
  goal: string;
  adherence: number; // % of planned sessions completed, last 14 days
  lastActive: string;
  weightTrend: number; // kg over 30 days
  status: "on-track" | "needs-attention" | "new";
  plan: Plan;
  program: string;
  sharing: { weight: boolean; workouts: boolean; nutrition: boolean };
}

export interface Message { id: string; from: string; body: string; at: string; mine?: boolean; context?: string }
export interface Notification { id: string; kind: "program" | "message" | "reminder" | "system"; title: string; body: string; at: string; read: boolean; to?: string }
