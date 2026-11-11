import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { RequireRole } from "./components/RequireRole";
import { homeFor, useAuth } from "./lib/auth";

import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Login } from "./pages/auth/Login";
import { Onboarding } from "./pages/auth/Onboarding";
import { Register } from "./pages/auth/Register";

import { Dashboard } from "./pages/user/Dashboard";
import { ExerciseDetail } from "./pages/user/ExerciseDetail";
import { Exercises } from "./pages/user/Exercises";
import { FindCoach } from "./pages/user/FindCoach";
import { Messages } from "./pages/user/Messages";
import { Notifications } from "./pages/user/Notifications";
import { Nutrition } from "./pages/user/Nutrition";
import { Premium } from "./pages/user/Premium";
import { Progress } from "./pages/user/Progress";
import { Settings } from "./pages/user/Settings";
import { WorkoutBuilder } from "./pages/user/WorkoutBuilder";
import { Workouts } from "./pages/user/Workouts";
import { WorkoutSession } from "./pages/user/WorkoutSession";

import { ClientDetail } from "./pages/coach/ClientDetail";
import { CoachDashboard } from "./pages/coach/CoachDashboard";
import { Programs } from "./pages/coach/Programs";
import { Requests } from "./pages/coach/Requests";
import { Schedule } from "./pages/coach/Schedule";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Audit } from "./pages/admin/Audit";
import { Content } from "./pages/admin/Content";
import { Reports } from "./pages/admin/Reports";
import { Users } from "./pages/admin/Users";

import { NotFound } from "./pages/NotFound";
import { Status } from "./pages/Status";

// Single-file preview builds have no server rewrites, so they use hash routing.
const Router = import.meta.env.MODE === "preview" ? HashRouter : BrowserRouter;

function Home() {
  const { session } = useAuth();
  return <Navigate to={session ? homeFor(session.role) : "/login"} replace />;
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<RequireRole roles={["user"]}><AppShell /></RequireRole>}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/exercises" element={<Exercises />} />
          <Route path="/app/exercises/:id" element={<ExerciseDetail />} />
          <Route path="/app/workouts" element={<Workouts />} />
          <Route path="/app/workouts/new" element={<WorkoutBuilder />} />
          <Route path="/app/workouts/:id/edit" element={<WorkoutBuilder />} />
          <Route path="/app/workouts/:id/session" element={<WorkoutSession />} />
          <Route path="/app/nutrition" element={<Nutrition />} />
          <Route path="/app/progress" element={<Progress />} />
          <Route path="/app/premium" element={<Premium />} />
          <Route path="/app/messages" element={<Messages />} />
          <Route path="/app/coaches" element={<FindCoach />} />
          <Route path="/app/notifications" element={<Notifications />} />
        </Route>

        <Route element={<RequireRole roles={["coach"]}><AppShell /></RequireRole>}>
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/clients/:id" element={<ClientDetail />} />
          <Route path="/coach/requests" element={<Requests />} />
          <Route path="/coach/programs" element={<Programs />} />
          <Route path="/coach/programs/new" element={<WorkoutBuilder backTo="/coach/programs" forClient="a client" />} />
          <Route path="/coach/programs/:id/edit" element={<WorkoutBuilder backTo="/coach/clients/u1" />} />
          <Route path="/coach/schedule" element={<Schedule />} />
          <Route path="/coach/messages" element={<Messages coachView />} />
        </Route>

        <Route element={<RequireRole roles={["admin"]}><AppShell /></RequireRole>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/content" element={<Content />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/audit" element={<Audit />} />
        </Route>

        <Route element={<RequireRole roles={["user", "coach", "admin"]}><AppShell /></RequireRole>}>
          <Route path="/settings" element={<Settings />} />
          <Route path="/status" element={<Status />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
