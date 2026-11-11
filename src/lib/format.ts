import type { Food } from "./types";

export const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

export function scaleFood(f: Food, qty: number) {
  const k = qty / f.per;
  return { kcal: f.kcal * k, protein: f.protein * k, carbs: f.carbs * k, fat: f.fat * k };
}

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Dates are handled as local "YYYY-MM-DD" strings so a diary day never shifts with UTC (FIT-034).
export function parseDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function toDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(iso: string, n: number) {
  const d = parseDay(iso); d.setDate(d.getDate() + n); return toDay(d);
}
export const fmtDay = (iso: string) => { const d = parseDay(iso); return `${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`; };
export const fmtShort = (iso: string) => { const d = parseDay(iso); return `${d.getDate()} ${MON[d.getMonth()]}`; };
export const weekday = (iso: string) => DAY[parseDay(iso).getDay()];
export function weekOf(iso: string) {
  const d = parseDay(iso);
  const monday = addDays(iso, -((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}
