import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

const googleId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? "";
const googleSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? "";

const googleProvider =
  googleId && googleSecret ?
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  : null;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ...(googleProvider ? [googleProvider] : []),
    Password({
      // Match bootstrap/seed lowercasing so sign-in finds the same auth account id.
      profile: (params) => ({
        email: String(params.email ?? "")
          .trim()
          .toLowerCase(),
      }),
    }),
  ],
  jwt: {
    // Convex's UserIdentity.email comes from this claim; default tokens only had `sub`.
    async customClaims(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!user) return {};
      return {
        ...(user.email !== undefined ? { email: user.email } : {}),
        ...(user.name !== undefined ? { name: user.name } : {}),
      };
    },
  },
});
