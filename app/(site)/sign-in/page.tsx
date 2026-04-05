"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingLogoScreen } from "@/components/site/loading-logo-screen";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
}

function SignInInner() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(
    () => safeNextPath(searchParams.get("next")),
    [searchParams],
  );

  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(next);
    }
  }, [isAuthenticated, isLoading, router, next]);

  async function signInWithGoogle() {
    setError(null);
    const origin = window.location.origin;
    try {
      const result = await signIn("google", {
        redirectTo: `${origin}${next}`,
      });
      if (result.redirect) {
        window.location.href = result.redirect.href;
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Google sign-in is unavailable.";
      setError(
        `${msg} Check Google OAuth configuration and authorized redirect URIs.`,
      );
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-28 md:pt-32">
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
        Account
      </p>
      <h1 className="font-heading mt-4 text-3xl text-on-surface">
        Sign in
      </h1>
      <p className="mt-3 font-sans text-sm text-on-surface-variant">
        Access your order history and account details.
      </p>

      <div className="mt-10 space-y-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-none border-outline-variant/40 bg-surface-container-low font-sans text-sm text-on-surface hover:bg-surface-container"
          onClick={() => void signInWithGoogle()}
        >
          Continue with Google
        </Button>

        <div className="relative py-2 text-center">
          <span className="relative z-10 bg-surface px-3 font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            or email
          </span>
          <div className="absolute left-0 right-0 top-1/2 z-0 h-px bg-outline-variant/30" />
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const form = new FormData(e.currentTarget);
            void signIn("password", form).catch((err: unknown) => {
              const detail =
                err instanceof Error ? err.message : "Sign-in failed.";
              if (step === "signUp") {
                setError(
                  `${detail} If you already have an account, switch to Sign in.`,
                );
                return;
              }
              setError(detail);
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
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
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
              className="rounded-none border-outline-variant/40 bg-surface-container-low"
            />
          </div>
          <input type="hidden" name="flow" value={step} />
          {error ? (
            <p className="text-xs text-red-400/90">{error}</p>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-none gold-gradient font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
            disabled={isLoading}
          >
            {step === "signIn" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          className="w-full text-center font-sans text-xs text-on-surface-variant underline-offset-4 hover:text-gold hover:underline"
          onClick={() => {
            setStep(step === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {step === "signIn"
            ? "New customer? Create an account"
            : "Have an account? Sign in"}
        </button>

        <p className="text-center font-sans text-xs text-on-surface-variant">
          <Link href="/shop" className="text-gold underline-offset-4 hover:underline">
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <LoadingLogoScreen
          variant="site"
          size="compact"
          className="min-h-[40vh] pt-24 text-on-surface-variant"
        />
      }
    >
      <SignInInner />
    </Suspense>
  );
}
