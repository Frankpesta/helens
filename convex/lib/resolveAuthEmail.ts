import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

const EMAIL_LIKE =
  /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

/** Best-effort email for Convex Auth user (users row, password id, or any account id that looks like an email). */
export async function resolveAuthEmailForUserId(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
): Promise<string | null> {
  const user = await ctx.db.get(userId);
  if (user?.email) return user.email.trim().toLowerCase();

  const password = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) =>
      q.eq("userId", userId).eq("provider", "password"),
    )
    .unique();
  if (password?.providerAccountId) {
    return password.providerAccountId.trim().toLowerCase();
  }

  const accounts = await ctx.db
    .query("authAccounts")
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect();
  for (const a of accounts) {
    const id = a.providerAccountId?.trim() ?? "";
    if (EMAIL_LIKE.test(id)) return id.toLowerCase();
  }

  return null;
}
