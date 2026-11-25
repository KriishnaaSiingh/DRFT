import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { QrCode, ArrowLeft, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/unassigned")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search["id"] === "string" ? search["id"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Card Not Yet Active — QR Routing Manager" },
      {
        name: "description",
        content: "This QR card hasn't been assigned a destination yet.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnassignedPage,
});

function UnassignedPage() {
  const { id } = useSearch({ from: "/unassigned" });
  const [checking, setChecking] = useState(!!id);

  // Client-side fallback check: If server SSR had a transient cache/network miss
  // or old deploy state, check Supabase directly from browser to redirect if card has a URL!
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function checkCard() {
      try {
        const { data: card } = await supabase
          .from("qr_cards")
          .select("destination_url, status")
          .eq("id", id)
          .maybeSingle();

        if (isMounted && card?.destination_url) {
          window.location.replace(card.destination_url);
          return;
        }
      } catch (err) {
        console.error("Client fallback check failed:", err);
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    checkCard();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="grid-noise flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <QrCode className="size-5 text-primary" />
          QR Router
        </Link>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm text-center">
          {/* Animated icon */}
          <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <div className="relative flex size-20 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <WifiOff className="size-8 text-muted-foreground" />
            </div>
          </div>

          {/* Badge */}
          {id && (
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 font-display text-xs font-semibold tracking-widest text-secondary-foreground uppercase">
              <QrCode className="size-3" />
              Card {id}
            </p>
          )}

          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Not yet active
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This QR card hasn&apos;t been pointed at a destination yet.
            <br />
            Ask the shop owner to activate it in the dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </Button>
          </div>

          <p className="mt-10 text-xs text-muted-foreground/60">
            If you believe this is an error, scan the QR code again or contact support.
          </p>
        </div>
      </main>
    </div>
  );
}
