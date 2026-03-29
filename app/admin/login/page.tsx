"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card/40 p-8">
        <div>
          <p className="font-heading text-xl text-gold">Admin access</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use an email allowlisted in Convex <code className="text-gold">ADMIN_EMAILS</code>.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const form = new FormData(e.currentTarget);
            void signIn("password", form).catch((err: unknown) => {
              if (step === "signUp") {
                setError(
                  "Sign-up failed. You may already have an account — use Sign in or /admin/setup.",
                );
                return;
              }
              const detail =
                err instanceof Error ? err.message : "Sign-in failed.";
              setError(
                `${detail} Use the same email and password as when you bootstrapped. In Convex, set ADMIN_EMAILS to include that email.`,
              );
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                step === "signIn" ? "current-password" : "new-password"
              }
              required
              minLength={8}
              className="bg-background"
            />
          </div>
          <input type="hidden" name="flow" value={step} />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <Button
            type="submit"
            className="w-full bg-gold text-primary-foreground hover:bg-gold/90"
            disabled={isLoading}
          >
            {step === "signIn" ? "Sign in" : "Create admin account"}
          </Button>
        </form>
        <button
          type="button"
          className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
          onClick={() => {
            setStep(step === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {step === "signIn"
            ? "Need to register this device? Sign up"
            : "Have an account? Sign in"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          First deploy?{" "}
          <Link
            href="/admin/setup"
            className="text-gold underline-offset-4 hover:underline"
          >
            Bootstrap admin (one-time)
          </Link>
        </p>
      </div>
    </div>
  );
}
