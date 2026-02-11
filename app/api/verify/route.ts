import { NextResponse } from "next/server";
import { ActuaryEngine } from "@/lib/actuarial/engine";
import { getQx } from "@/lib/actuarial/tmi-iv";
import Decimal from "decimal.js";

export async function GET() {
    // Test Case Specification
    // Name: Budi (Sample)
    // DOB: 1990-01-01 (Age ~34 in 2024)
    // DOJ: 2020-01-01 (Past Service ~4 years)
    // Salary: 10,000,000
    // Valuation Date: 2024-01-01

    const valDate = new Date("2024-01-01");
    const dob = new Date("1990-01-01"); // Age 34
    const doj = new Date("2020-01-01"); // Service 4
    const salary = 10000000;

    const assumptions = {
        valDate: valDate,
        retirementAge: 55,
        discountRate: 0.07,     // 7%
        salaryIncrease: 0.05,   // 5%
        pensionMult: 1.75,
        disabilityMult: 2.0,
        deathMult: 2.0,
        resignMult: 0.0,
    };

    const engine = new ActuaryEngine(
        { dob, doj, salary },
        assumptions
    );

    // Result
    const result = engine.calculatePUC();

    // Manual Trace Construction for User Verification
    const ageVal = 34;
    const yearsToRetire = 55 - 34; // 21 years
    const pastService = 4;
    const totalService = pastService + yearsToRetire; // 25 years

    // 1. Projected Salary
    // 10jt * (1.05)^21
    const projSalaryFactor = new Decimal(1.05).pow(yearsToRetire);
    const projSalary = new Decimal(salary).times(projSalaryFactor);

    // 2. Benefit
    const totalServiceAtRetirement = totalService;

    // Detailed Trace Object
    const trace = {
        input: {
            name: "Test Employee (Budi)",
            dob: "1990-01-01",
            doj: "2020-01-01",
            valDate: "2024-01-01",
            salary: salary,
            age: ageVal,
            pastService: pastService,
            yearsToRetire: yearsToRetire,
            totalServiceAtRetirement: totalService
        },
        assumptions: {
            discount: "7%",
            salaryInc: "5%",
            retAge: 55,
            pensionMult: 1.75
        },
        steps: {
            step1_projectedSalary: {
                formula: `Salary * (1 + inc)^${yearsToRetire}`,
                value: projSalary.toFixed(2),
                factor: projSalaryFactor.toFixed(6)
            },
            step2_benefitCalculation: {
                description: "Pension Benefit at Retirement",
                formula: "Multiplier * TableFactor * ProjSalary",
                // Accessing private method for trace if possible, or just re-deriving
                // tableFactorUsed: engine['getTablePMTK'](totalService), 
                projectedBenefit: result.projectedBenefit.toFixed(2)
            },
            step3_discountFactor: {
                formula: `1 / (1 + i)^${yearsToRetire}`,
                value: new Decimal(1).div(new Decimal(1.07).pow(yearsToRetire)).toFixed(6)
            },
            step4_probabilitySurvival: {
                description: `Product of (1-qx) from age ${ageVal} to 55`,
                value: "Calculated internally (Compound probability)"
            },
            step5_finalPVDBO: {
                formula: "PV_Benefit * (PastService / TotalService)",
                attributionRatio: `${pastService} / ${totalService} = ${(pastService / totalService).toFixed(4)}`,
                value: result.pvdbo.toFixed(2)
            }
        },
        result: {
            PVDBO: "Rp " + result.pvdbo.toFixed(2),
            ServiceCost: "Rp " + result.serviceCost.toFixed(2),
            InterestCost: "Rp " + result.interestCost.toFixed(2)
        }
    };

    return NextResponse.json(trace);
}
