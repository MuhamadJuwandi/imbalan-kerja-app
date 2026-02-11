import Decimal from 'decimal.js';
import { getQx } from './tmi-iv';

// Configure Decimal.js for financial precision
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface EmployeeData {
    dob: Date;
    doj: Date;
    salary: number;
}

export interface Assumptions {
    valDate: Date;
    retirementAge: number;
    discountRate: number; // e.g., 0.07 for 7%
    salaryIncrease: number; // e.g., 0.05 for 5%
    pensionMult: number;
    disabilityMult: number;
    deathMult: number;
    resignMult: number;
}

export interface CalculationResult {
    pvdbo: Decimal;
    serviceCost: Decimal;
    interestCost: Decimal;
    projectedBenefit: Decimal;
    vested: boolean;
}

export class ActuaryEngine {
    private data: EmployeeData;
    private assum: Assumptions;

    constructor(data: EmployeeData, assum: Assumptions) {
        this.data = data;
        this.assum = assum;
    }

    // Calculate age at valuation date
    private getAge(date: Date): number {
        const diff = date.getTime() - this.data.dob.getTime();
        return diff / (1000 * 60 * 60 * 24 * 365.25);
    }

    // Calculate past service years
    private getPastService(date: Date): number {
        const diff = date.getTime() - this.data.doj.getTime();
        return Math.max(0, diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    // Projected Unit Credit (PUC) Calculation
    public calculatePUC(): CalculationResult {
        const ageVal = this.getAge(this.assum.valDate);
        const pastService = this.getPastService(this.assum.valDate);
        const yearsToRetire = this.assum.retirementAge - ageVal;

        // 0. Preliminary Checks
        if (yearsToRetire <= 0) {
            // Already retired or at retirement age -> Specific handling (simplified to immediate liability)
            const salary = new Decimal(this.data.salary);
            const benefit = salary.times(this.assum.pensionMult).times(this.getTablePMTK(pastService));
            return {
                pvdbo: benefit,
                serviceCost: new Decimal(0),
                interestCost: new Decimal(0),
                projectedBenefit: benefit,
                vested: true
            };
        }

        // 1. Projection of Salary
        // Sal_ret = Sal_val * (1 + inc)^(retAge - ageVal)
        const currentSalary = new Decimal(this.data.salary);
        const projectedSalary = currentSalary.times(
            new Decimal(1 + this.assum.salaryIncrease).pow(yearsToRetire)
        );

        // 2. Projected Benefit (Pension)
        // Benefit = Multiplier * Table(TotalService) * ProjSalary
        const totalServiceAtRetirement = pastService + yearsToRetire;
        const tableFactor = this.getTablePMTK(totalServiceAtRetirement);
        const projectedBenefit = projectedSalary
            .times(this.assum.pensionMult)
            .times(tableFactor);

        // 3. Discount Factor
        // v^t = 1 / (1 + i)^t
        const discountFactor = new Decimal(1).div(
            new Decimal(1 + this.assum.discountRate).pow(yearsToRetire)
        );

        // 4. Probability of Survival (tpx)
        // Simplified: Product of (1 - qx) from ageVal to retirementAge
        let probSurvival = new Decimal(1.0);
        for (let age = Math.floor(ageVal); age < this.assum.retirementAge; age++) {
            const qx = getQx(age);
            probSurvival = probSurvival.times(1 - qx);
        }

        // 5. PVDBO Calculation (Allocated Benefit)
        // PVDBO = PV(Benefit) * (PastService / TotalService)
        const presentValueBenefit = projectedBenefit.times(discountFactor).times(probSurvival);

        // Attribution (Straight Line for PUC)
        // If IFRIC decision applies, attribution might be limited to last N years, but standard PUC is S_past / S_total
        const attributionRatio = totalServiceAtRetirement === 0
            ? new Decimal(0)
            : new Decimal(pastService).div(totalServiceAtRetirement);

        const pvdbo = presentValueBenefit.times(attributionRatio);

        // 6. Service Cost (Current Service Cost)
        // CSC = PV(Benefit) * (1 / TotalService)
        const serviceCost = totalServiceAtRetirement === 0
            ? new Decimal(0)
            : presentValueBenefit.div(totalServiceAtRetirement);

        // 7. Interest Cost
        // IC = PVDBO * discountRate
        const interestCost = pvdbo.times(this.assum.discountRate);

        return {
            pvdbo,
            serviceCost,
            interestCost,
            projectedBenefit,
            vested: pastService >= 3 // Example vesting
        };
    }

    // PP 35/2021 Table (Approximate Logic for demonstration)
    // Can be replaced with exact lookup table
    private getTablePMTK(years: number): number {
        const y = Math.floor(years);
        if (y < 1) return 0;
        if (y < 2) return 1;
        if (y < 3) return 2;
        if (y < 4) return 3;
        if (y < 5) return 4;
        if (y < 6) return 5;
        if (y < 7) return 6;
        if (y < 8) return 7;
        // ... continues up to 9 for >24 years usually, but PP35 has specific rules
        // Using simplified standard termination standard for illustration
        if (y >= 24) return 9; // Max multiplier usually
        return y;
    }
}
