import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Decimal from "decimal.js";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  try {
    let rules = await prisma.companyRule.findUnique({
      where: { userId },
    });

    if (!rules) {
      // Create default per PP 35/2021 for this specific user
      rules = await prisma.companyRule.create({
        data: {
          userId,
          retirementAge: 55,
          pensionMultiplier: new Decimal(1.75),
          disabilityMult: new Decimal(2.0),
          deathMult: new Decimal(2.0),
          resignMult: new Decimal(0.0),
        },
      });
    }

    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 });
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
    const { retirementAge, pensionMultiplier, disabilityMult, deathMult, resignMult } = body;

    const rules = await prisma.companyRule.upsert({
        where: { userId },
        update: {
            retirementAge: Number(retirementAge),
            pensionMultiplier: new Decimal(pensionMultiplier || 1.75),
            disabilityMult: new Decimal(disabilityMult || 2.0),
            deathMult: new Decimal(deathMult || 2.0),
            resignMult: new Decimal(resignMult || 0.0)
        },
        create: {
            userId,
            retirementAge: Number(retirementAge),
            pensionMultiplier: new Decimal(pensionMultiplier || 1.75),
            disabilityMult: new Decimal(disabilityMult || 2.0),
            deathMult: new Decimal(deathMult || 2.0),
            resignMult: new Decimal(resignMult || 0.0)
        }
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Error updating rules:", error);
    return NextResponse.json({ error: "Failed to update rules" }, { status: 500 });
  }
}
