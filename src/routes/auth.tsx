import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — QR Routing Manager" },
      {
        name: "description",
        content: "Sign in to manage QR card destinations and scan analytics.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin sign in — QR Routing Manager" },
      { property: "og:description", content: "Sign in to manage QR card destinations." },
    ],
  }),
  component: AuthPage,
});

const ADMIN_EMAIL = "krishnasingh15kks@gmail.com";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin", replace: true });
  }, [loading, user, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Access denied. This account is not authorised.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="grid-noise flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <QrCode className="size-5 text-primary" />
          QR Router
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-start justify-center px-5 pb-16">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-card-foreground">Admin access</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage QR card destinations and analytics.
          </p>

          <form className="mt-6 space-y-4" onSubmit={signIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
