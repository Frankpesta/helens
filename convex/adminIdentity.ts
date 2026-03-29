import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { resolveAuthEmailForUserId } from "./lib/resolveAuthEmail";

/** Used by actions when JWT has no email claim; matches query-side requireAdmin resolution. */
export const resolveEmailForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await resolveAuthEmailForUserId(ctx, userId);
  },
});
