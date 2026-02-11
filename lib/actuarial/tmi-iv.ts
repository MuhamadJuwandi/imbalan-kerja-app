// TMI IV (Tabel Mortalita Indonesia IV)
// Format: Age -> qx (Probability of dying)
// Source: Standar Aktuaria (Simplified for implementation, usually goes up to 110)

export const TMI_IV: Record<number, number> = {
    15: 0.00079,
    16: 0.00083,
    17: 0.00088,
    18: 0.00092,
    19: 0.00096,
    20: 0.00100,
    21: 0.00103,
    22: 0.00106,
    23: 0.00109,
    24: 0.00111,
    25: 0.00113,
    26: 0.00115,
    27: 0.00117,
    28: 0.00120,
    29: 0.00123,
    30: 0.00127,
    31: 0.00132,
    32: 0.00138,
    33: 0.00145,
    34: 0.00154,
    35: 0.00164,
    36: 0.00176,
    37: 0.00190,
    38: 0.00206,
    39: 0.00224,
    40: 0.00244,
    41: 0.00267,
    42: 0.00293,
    43: 0.00322,
    44: 0.00355,
    45: 0.00392,
    46: 0.00433,
    47: 0.00479,
    48: 0.00531,
    49: 0.00590,
    50: 0.00656,
    51: 0.00730,
    52: 0.00813,
    53: 0.00906,
    54: 0.01009,
    55: 0.01124,
    56: 0.01252,
    57: 0.01391,
    58: 0.01544,
    59: 0.01710,
    60: 0.01891,
    // ... can be extended as needed, stops at typical retirement for now
};

export function getQx(age: number): number {
    return TMI_IV[age] || 1.0; // Default to 1.0 (certain death) if out of bounds high, or 0 if low (handled by logic)
}
