// Runtime configuration.
// In Docker, /env-config.js is generated at container start, so one image works in dev,
// staging and prod. Locally (npm run dev) it falls back to the VITE_* variables in .env.
declare global {
  interface Window { __ENV__?: { API_URL?: string; APP_VERSION?: string } }
}

export const config = {
  apiUrl: window.__ENV__?.API_URL ?? import.meta.env.VITE_API_URL ?? "/api",
  version: window.__ENV__?.APP_VERSION ?? "dev",
};
