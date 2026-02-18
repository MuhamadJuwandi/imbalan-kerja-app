import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        return NextResponse.json({
            status: "success",
            message: "Database connected successfully",
            userCount
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: "Database connection failed",
            error: error.message
        }, { status: 500 });
    }
}
