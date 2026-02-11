import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password, company } = await req.json();

        if (!email || !password || !company) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                company,
            },
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
