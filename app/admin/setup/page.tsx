"use client";

import { useAction } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSetupPage() {
  const seedAdmin = useAction(api.seedAdmin.seedAdminAccount);
  const [bootstrapSecret, setBootstrapSecret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    alreadyExisted: boolean;
    email: string;
    hint: string;
  } | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card/40 p-8">
        <div>
          <p className="font-heading text-xl text-gold">Bootstrap admin account</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Requires{" "}
            <code className="text-gold/90">ADMIN_BOOTSTRAP_SECRET</code> in your Convex
            deployment. The email must also appear in{" "}
            <code className="text-gold/90">ADMIN_EMAILS</code>. Remove or rotate the
            bootstrap secret after you are done.
          </p>
        </div>

        {result ? (
          <div className="space-y-4 rounded-md border border-gold/30 bg-gold/5 p-4 text-sm">
            <p className="font-medium text-foreground">
              {result.alreadyExisted
                ? "Account already exists for this email."
                : "Admin account created."}
            </p>
            <p className="text-muted-foreground">{result.hint}</p>
            <p className="text-xs text-muted-foreground">
              Signed in as{" "}
              <span className="font-mono text-gold/90">{result.email}</span>
            </p>
            <Button
              asChild
              className="w-full bg-gold text-primary-foreground hover:bg-gold/90"
            >
              <Link href="/admin/login">Go to admin sign-in</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted-foreground"
              onClick={() => {
                setResult(null);
                setBootstrapSecret("");
                setPassword("");
              }}
            >
              Run again
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              const trimmedEmail = email.trim();
              if (
                (trimmedEmail && password.length < 8) ||
                (!trimmedEmail && password.length > 0)
              ) {
                setError(
                  "Use a password of at least 8 characters with the email, or leave both email and password empty if ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD are set in Convex.",
                );
                return;
              }
              setBusy(true);
              const payload = {
                bootstrapSecret: bootstrapSecret.trim(),
                ...(trimmedEmail
                  ? { email: trimmedEmail, password }
                  : {}),
              };
              void seedAdmin(payload)
                .then((res) => {
                  setResult({
                    alreadyExisted: res.alreadyExisted,
                    email: res.email,
                    hint: res.hint,
                  });
                })
                .catch((err: Error) => {
                  setError(err.message ?? "Request failed");
                })
                .finally(() => setBusy(false));
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="bootstrapSecret">Bootstrap secret</Label>
              <Input
                id="bootstrapSecret"
                name="bootstrapSecret"
                type="password"
                autoComplete="off"
                required
                value={bootstrapSecret}
                onChange={(e) => setBootstrapSecret(e.target.value)}
                className="bg-background font-mono text-sm"
                placeholder="Same value as ADMIN_BOOTSTRAP_SECRET"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Admin email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
                placeholder="Leave empty if ADMIN_SEED_EMAIL is set in Convex"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
                placeholder="Min 8 characters, or use ADMIN_SEED_PASSWORD in env"
              />
            </div>
            {error ? (
              <p className="text-xs text-destructive leading-relaxed">{error}</p>
            ) : null}
            <Button
              type="submit"
              className="w-full bg-gold text-primary-foreground hover:bg-gold/90"
              disabled={busy}
            >
              {busy ? "Creating…" : "Create admin account"}
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/admin/login"
            className="text-gold underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
