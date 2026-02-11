import NextAuth from "next-auth";
import { auth as authConfig } from "@/auth"; // Use the config from auth.ts
// Wait, `auth.ts` exports { auth } which is the NextAuth instance.
// Middleware usually needs `auth` from `NextAuth(config).auth`

export { auth as middleware } from "@/auth";

export const config = {
    matcher: ["/dashboard/:path*", "/karyawan/:path*", "/peraturan/:path*", "/perhitungan/:path*"],
};
