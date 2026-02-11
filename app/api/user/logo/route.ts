import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    try {
        const { logo } = await req.json();

        if (!logo) {
            return NextResponse.json({ error: "Logo is required" }, { status: 400 });
        }

        // Update user logo
        await prisma.user.update({
            where: { id: userId },
            data: { logo },
        });

        return NextResponse.json({ message: "Logo updated successfully" });
    } catch (error) {
        console.error("Error updating logo:", error);
        return NextResponse.json({ error: "Failed to update logo" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = parseInt(session.user.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { logo: true },
        });

        if (!user?.logo) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Parse Data URL: data:image/png;base64,iVBOR...
        const matches = user.logo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            return new NextResponse("Invalid logo format", { status: 500 });
        }

        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, max-age=60", // Cache for 1 min
            },
        });

    } catch (error) {
        console.error("Error fetching logo:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
