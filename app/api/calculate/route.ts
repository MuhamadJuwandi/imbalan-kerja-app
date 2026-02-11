import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ActuaryEngine } from "@/lib/actuarial/engine";
import Decimal from "decimal.js";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = parseInt(session.user.id);

    try {
        // Fetch user's employees and rules
        const employees = await prisma.employee.findMany({ where: { userId } });
        const rules = await prisma.companyRule.findUnique({ where: { userId } });

        if (!rules) {
            return NextResponse.json({ error: "Peraturan Perusahaan belum disetting untuk akun ini" }, { status: 400 });
        }

        if (employees.length === 0) {
            return NextResponse.json({ error: "Belum ada data karyawan" }, { status: 400 });
        }

        const { valDate = new Date() } = await req.json();
        const valuationDate = new Date(valDate);

        const results = employees.map((emp) => {
            const engine = new ActuaryEngine(
                {
                    dob: emp.dob,
                    doj: emp.doj,
                    salary: Number(emp.salary),
                },
                {
                    valDate: valuationDate,
                    retirementAge: rules.retirementAge,
                    discountRate: 0.07,
                    salaryIncrease: 0.05,
                    pensionMult: Number(rules.pensionMultiplier),
                    disabilityMult: Number(rules.disabilityMult),
                    deathMult: Number(rules.deathMult),
                    resignMult: Number(rules.resignMult),
                }
            );

            const res = engine.calculatePUC();

            return {
                employeeId: emp.id,
                name: emp.name,
                nik: emp.nik,
                pvdbo: res.pvdbo.toFixed(2),
                serviceCost: res.serviceCost.toFixed(2),
                interestCost: res.interestCost.toFixed(2),
            };
        });

        return NextResponse.json({
            date: valuationDate,
            totalPVDBO: results.reduce((acc, curr) => acc.add(new Decimal(curr.pvdbo)), new Decimal(0)).toFixed(2),
            details: results
        });

    } catch (error) {
        console.error("Calculation Error:", error);
        return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
    }
}
