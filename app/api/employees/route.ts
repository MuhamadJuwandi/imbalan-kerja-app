import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Use auth helper

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    try {
        const employees = await prisma.employee.findMany({
            where: { userId }, // Filter by user
            orderBy: { name: "asc" },
        });
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    try {
        const body = await req.json();
        const { nik, name, salary, dob, doj, status } = body;

        if (!nik || !name || !salary || !dob || !doj) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const employee = await prisma.employee.create({
            data: {
                nik,
                name,
                salary: Number(salary),
                dob: new Date(dob),
                doj: new Date(doj),
                status: status || "TETAP",
                userId, // Link to user
            },
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
    }
}
