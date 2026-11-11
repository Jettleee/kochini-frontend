# KOCHINI — frontend

React + TypeScript client for the fitness coaching platform (FIT-010).
Front end only: every screen runs on mock data in `src/lib/mock.ts` until the Spring Boot API is ready.

## Run

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/ (serve with nginx, FIT-118)
npm run build:preview  # single-file clickable demo in dist-preview/index.html
```

Log in with the **Athlete / Coach / Admin** demo buttons, or switch role from the sidebar.

## Stack

Vite, React 18, TypeScript (strict), React Router 6, Tailwind CSS 3, Recharts, lucide-react.

## Structure

```
src/
  lib/          types.ts (domain model, FIT-013), mock.ts, auth.tsx (session + roles), format.ts (local-date helpers)
  components/   ui.tsx (design system, FIT-005), AppShell, RequireRole (FIT-026), Barbell, MuscleMap
  pages/auth    Login, Register, ForgotPassword, Onboarding
  pages/user    Dashboard, Exercises, ExerciseDetail, Workouts, WorkoutBuilder, WorkoutSession,
                Nutrition, Progress, Premium, Messages, FindCoach, Notifications, Settings
  pages/coach   CoachDashboard, ClientDetail, Programs, Requests, Schedule
  pages/admin   AdminDashboard, Users, Content, Reports, Audit
```

Each page starts with a comment listing the backlog stories it covers.

## Routes

| Role | Routes |
|---|---|
| Public | `/login` `/register` `/forgot-password` `/onboarding` |
| Athlete | `/app` `/app/workouts` `/app/workouts/new` `/app/workouts/:id/edit` `/app/workouts/:id/session` `/app/exercises` `/app/exercises/:id` `/app/nutrition` `/app/progress` `/app/messages` `/app/coaches` `/app/notifications` `/app/premium` |
| Coach | `/coach` `/coach/clients/:id` `/coach/requests` `/coach/programs` `/coach/programs/new` `/coach/schedule` `/coach/messages` |
| Admin | `/admin` `/admin/users` `/admin/content` `/admin/reports` `/admin/audit` |
| All signed-in | `/settings` `/status` |

## Design system

| Token | Value | Use |
|---|---|---|
| chalk | `#EEF0EC` | App background |
| iron | `#1C2127` | Sidebar, text |
| steel | `#5F6872` | Secondary text |
| plate blue | `#1D4E9E` | Actions, links, focus |
| plate red | `#C8323C` | Protein |
| plate yellow | `#E2A20B` | Carbs |
| plate green | `#2F8559` | Fat, success |

The plate colours come from competition bumper plates and always mean the same thing.
Type: Barlow Condensed for headings and numbers, Barlow for text.
The logo is a "K" whose stem is a blue plate seen edge-on (`src/components/Logo.tsx`, favicon in `public/favicon.svg`).
The dashboard's signature element draws today's macros as plates loaded on a barbell.

## Hooking up the API

1. Copy `.env.example` to `.env` and set `VITE_API_URL`.
2. Add `src/lib/api.ts` with a fetch wrapper that sends the JWT and maps the standard error format (FIT-011).
3. Replace mock imports page by page. The comments in each page note the endpoint to call.
4. `auth.tsx` stores a demo session in localStorage. Replace it with the backend token; the route guard is UX only, the API must enforce roles.

## Docker (FIT-118)

```bash
docker compose up --build                 # http://localhost:8080
# or
docker build -t kochini-frontend --build-arg APP_VERSION=1.0.0 .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp --cap-drop ALL \
  -e API_URL=https://api.example.com/api kochini-frontend
```

Multi-stage build: Node 22 compiles the app, then an unprivileged nginx (UID 101) serves `dist/` on **port 8080**.

### Runtime settings

| Variable | Default | Meaning |
|---|---|---|
| `API_URL` | `/api` | Where the browser sends API calls. A path means same origin (reverse proxy); a full URL also gets added to the CSP `connect-src`. |
| `APP_VERSION` | build arg | Shown in `window.__ENV__`, set by CI from the image tag. |

The same image runs in dev, staging and prod: at startup `docker/entrypoint.d/15-kochini-config.sh` writes `/env-config.js`
(read by `src/lib/config.ts`) and the security headers. Values are validated and the container refuses to start on a bad one.
No secrets go into the image or into `env-config.js`, since everything the browser downloads is public.

### What the container does

- `/healthz` returns `200 ok` for liveness/readiness probes (Docker `HEALTHCHECK` uses it too).
- Any unknown path returns `index.html`, so deep links like `/app/nutrition` work on reload.
- `/assets/*` (hashed file names) are cached for a year; `index.html` and `env-config.js` are never cached, so deploys show up immediately.
- Headers: CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS. `server_tokens off`, dotfiles return 404.
- Runs as non-root with a read-only root filesystem (only `/tmp` must be writable), all capabilities dropped.

### Azure

- **Container Apps / App Service:** ingress target port `8080`, liveness and readiness probes on `GET /healthz`, set `API_URL` as an environment variable.
- **AKS:** `runAsNonRoot: true`, `runAsUser: 101`, `readOnlyRootFilesystem: true`, an `emptyDir` mounted at `/tmp`, `capabilities.drop: [ALL]`.

## CI/CD (`.github/workflows/frontend.yml`)

| Stage | Runs on | Blocks on |
|---|---|---|
| Typecheck, tests (when added), build | PR + push | any error |
| `npm audit` on runtime dependencies | PR + push | high/critical |
| hadolint on the Dockerfile | PR + push | warnings |
| Docker build + smoke test (read-only, non-root, routes, CSP, env injection) | PR + push | any failure |
| Trivy image scan (SARIF to the Security tab) | PR + push | fixable critical CVEs |
| SBOM (SPDX) uploaded as a build artifact | PR + push | — |
| Push to ACR via OIDC (no stored password) | `main` and `v*` tags | — |

Image tags: short commit SHA (immutable, use this one to deploy), the branch name, and `1.2.3` for `v1.2.3` tags.

Setup: repository variable `ACR_NAME`, and secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
for an Entra app registration that has a federated credential for this repo and the `AcrPush` role on the registry.
For stricter supply-chain control, pin the actions and base images to commit SHAs / digests.
