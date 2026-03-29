import { getAuthUserId } from "@convex-dev/auth/server";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import type { UserIdentity } from "convex/server";
import { internal } from "../_generated/api";
import { resolveAuthEmailForUserId } from "./resolveAuthEmail";

function parseAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function adminEmailForIdentity(
  ctx: QueryCtx | MutationCtx,
  identity: UserIdentity,
): Promise<string | null> {
  const fromJwt = identity.email?.trim().toLowerCase();
  if (fromJwt) return fromJwt;
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return await resolveAuthEmailForUserId(ctx, userId);
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const allowed = parseAdminEmails();
  if (allowed.size === 0) {
    throw new Error(
      "Server misconfiguration: set ADMIN_EMAILS in Convex env (comma-separated lowercase emails).",
    );
  }
  const email = await adminEmailForIdentity(ctx, identity);
  if (!email) {
    throw new Error(
      "Unauthorized: no email on this session. Sign in again, or ensure your account has an email in Convex Auth.",
    );
  }
  if (!allowed.has(email)) {
    throw new Error(
      "Unauthorized: this account is not allowlisted. Add your exact sign-in email to ADMIN_EMAILS in Convex → Environment variables.",
    );
  }
  return email;
}

export async function requireAdminAction(ctx: ActionCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const allowed = parseAdminEmails();
  if (allowed.size === 0) {
    throw new Error(
      "Server misconfiguration: set ADMIN_EMAILS in Convex env (comma-separated lowercase emails).",
    );
  }
  let email = identity.email?.trim().toLowerCase();
  if (!email) {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      email =
        (await ctx.runQuery(internal.adminIdentity.resolveEmailForUser, {
          userId,
        })) ?? undefined;
    }
  }
  if (!email) {
    throw new Error(
      "Unauthorized: no email on this session for admin actions.",
    );
  }
  if (!allowed.has(email)) {
    throw new Error(
      "Unauthorized: this account is not listed in ADMIN_EMAILS.",
    );
  }
  return email;
}
