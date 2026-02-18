import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("User not found.");
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password.");
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.company,
                };
            },
        }),
    ],
});
