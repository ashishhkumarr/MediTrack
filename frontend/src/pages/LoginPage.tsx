import { useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/FormField";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const state = location.state as { from?: Location } | null;
      const redirectPath = state?.from?.pathname;
      navigate(redirectPath || "/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-subtle via-white to-sky-50 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_45%)]" />
      <div className="relative z-10 grid w-full max-w-5xl gap-10 md:grid-cols-2">
        <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-card backdrop-blur animate-slideUp">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">Clinic Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">MediTrack Admin Portal</h1>
          <p className="mt-3 text-base text-slate-500">
            Only clinic staff can access orchestration tools for patient journeys, schedules, and communications.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-brand/10 p-2 text-brand">1</div>
              Advanced scheduling intelligence
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-brand/10 p-2 text-brand">2</div>
              Unified patient insights
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-brand/10 p-2 text-brand">3</div>
=======
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-surface-subtle via-surface to-secondary-soft/60 px-6 py-10 shadow-card">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.16),_transparent_45%)]" />
      <div className="relative z-10 grid w-full max-w-none gap-10 rounded-[32px] border border-border/60 bg-surface/50 p-6 shadow-card backdrop-blur-md sm:p-10 lg:p-12 xl:grid-cols-2">
        <div className="rounded-3xl border border-border/40 bg-surface/70 p-8 shadow-card backdrop-blur animate-fadeUp">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Clinic Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-text">MediTrack Admin Portal</h1>
          <p className="mt-3 text-base text-text-muted">
            Only clinic staff can access orchestration tools for patient journeys, schedules, and communications.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-primary-soft/80 p-2 text-primary">1</div>
              Advanced scheduling intelligence
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-primary-soft/80 p-2 text-primary">2</div>
              Unified patient insights
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
              <div className="rounded-full bg-primary-soft/80 p-2 text-primary">3</div>
>>>>>>> v2
              Secure medical-grade access
            </div>
          </div>
        </div>
<<<<<<< HEAD
        <div className="glass-card animate-fadeIn border border-white/60 p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Welcome Back</h2>
              <p className="text-sm text-slate-500">Sign in with your clinic credentials.</p>
=======
        <div className="glass-card animate-fadeUp border border-border/60 p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-text">Welcome Back</h2>
              <p className="text-sm text-text-muted">Sign in with your clinic credentials.</p>
>>>>>>> v2
            </div>
            <InputField
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="clinician@meditrack.com"
            />
            <InputField
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              hint="Use the admin credentials from setup documentation."
            />
            {error && (
<<<<<<< HEAD
              <div className="rounded-2xl bg-accent-rose/10 px-4 py-3 text-sm text-accent-rose">
=======
              <div className="rounded-2xl bg-danger-soft/80 px-4 py-3 text-sm text-danger">
>>>>>>> v2
                {error}
              </div>
            )}
            <Button type="submit" isLoading={loading} className="w-full py-3 text-base">
              Sign In Securely
            </Button>
<<<<<<< HEAD
            <p className="text-center text-sm text-slate-500">
              Need an account?{" "}
              <Link to="/signup" className="font-semibold text-brand underline-offset-4 hover:underline">
=======
            <p className="text-center text-sm text-text-muted">
              Need an account?{" "}
              <Link to="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
>>>>>>> v2
                Create a clinic login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
