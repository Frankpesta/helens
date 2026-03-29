/**
 * Bootstrap the first admin Convex Auth user (password provider).
 *
 * 1. In Convex dashboard → Settings → Environment Variables, set:
 *    - ADMIN_BOOTSTRAP_SECRET — long random string (delete after first successful seed)
 *    - ADMIN_EMAILS — must include the same email (comma-separated), e.g. admin@yourdomain.com
 *    Optionally set ADMIN_SEED_EMAIL + ADMIN_SEED_PASSWORD so you can omit them from the CLI.
 *
 * 2. Run (replace values):
 *    npx convex run seedAdmin:seedAdminAccount '{"bootstrapSecret":"YOUR_SECRET","email":"admin@example.com","password":"your-secure-password"}'
 *
 * Or with seed credentials only in Convex env:
 *    npx convex run seedAdmin:seedAdminAccount '{"bootstrapSecret":"YOUR_SECRET"}'
 *
 * Or use the app UI (unauthenticated): /admin/setup
 */

import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { createAccount } from "@convex-dev/auth/server";

export const hasPasswordAccount = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", email),
      )
      .unique();
    return existing !== null;
  },
});

export const seedAdminAccount = action({
  args: {
    bootstrapSecret: v.string(),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected || args.bootstrapSecret !== expected) {
      throw new Error(
        "Invalid bootstrap: set ADMIN_BOOTSTRAP_SECRET in Convex and pass the same value.",
      );
    }

    const emailRaw = args.email ?? process.env.ADMIN_SEED_EMAIL;
    const password = args.password ?? process.env.ADMIN_SEED_PASSWORD;
    if (!emailRaw || !password) {
      throw new Error(
        "Provide email and password in the function arguments, or set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in Convex.",
      );
    }

    const email = emailRaw.trim().toLowerCase();
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const exists: boolean = await ctx.runQuery(internal.seedAdmin.hasPasswordAccount, {
      email,
    });
    if (exists) {
      return {
        ok: true as const,
        alreadyExisted: true,
        email,
        hint: "Account exists. Sign in at /admin/login. Ensure this email is in ADMIN_EMAILS.",
      };
    }

    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: {
        email,
        name: "Administrator",
      },
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });

    return {
      ok: true as const,
      alreadyExisted: false,
      email,
      hint: "Sign in at /admin/login. Ensure ADMIN_EMAILS in Convex includes this email.",
    };
  },
});
