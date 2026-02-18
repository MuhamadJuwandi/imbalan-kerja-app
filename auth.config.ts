import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                // Point to the API route that serves the image
                session.user.image = `/api/user/logo`;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isOnAuth) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
    providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;
