import { Ethnicity, Gender, SBMIResult } from '../types';

/**
 * Calculates Standard Body Mass Index
 * @param weightKg Weight in Kilograms
 * @param heightCm Height in Centimeters
 * @returns BMI value
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
    if (heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
};

/**
 * Returns Standard WHO BMI Category
 */
export const getStandardCategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' }; // Blue
    if (bmi < 24.9) return { category: 'Healthy Weight', color: '#22c55e' }; // Green
    if (bmi < 29.9) return { category: 'Overweight', color: '#eab308' }; // Yellow
    return { category: 'Obese', color: '#ef4444' }; // Red
};

/**
 * Returns Advanced SBMI Interpretation based on Ethnicity and Age.
 * Uses Lancet 2021 Diabetes Risk Equivalence thresholds.
 */
export const getSBMIInterpretation = (
    bmi: number,
    age: number,
    ethnicity: Ethnicity
): {
    category: string;
    color: string;
    minHealthyKPI: number;
    maxHealthyKPI: number;
} => {
    // Base thresholds (White / Standard WHO)
    let th_over = 25.0;
    let th_obese = 30.0;
    let th_under = 18.5;

    // 1. Ethnicity Adjustment
    switch (ethnicity) {
        case 'South Asian':
            th_over = 19.2; // Note: Very strict "Overweight" floor
            th_obese = 23.9;
            break;
        case 'Chinese':
            th_over = 22.2;
            th_obese = 26.9;
            break;
        case 'Black':
            th_over = 23.4;
            th_obese = 28.1;
            break;
        case 'Arab':
            th_over = 22.1;
            th_obese = 26.6;
            break;
        case 'Asian (Other)':
            th_over = 23.0; // General WHO Asian
            th_obese = 27.5;
            break;
        default:
            // White / European / Other / Mixed -> Standard
            th_over = 25.0;
            th_obese = 30.0;
            break;
    }

    // 2. Age Adjustment (Seniors need more reserves)
    if (age >= 65) {
        th_under = 22.0;
        // We do NOT raise the obesity threshold of ethnicity because diabetes risk is still high.
        // This creates a narrower optimal window for seniors of high-risk ethnicities.
    }

    // Categorize
    let category = '';
    let color = '';

    if (bmi < th_under) {
        category = 'Underweight / Frailty Risk';
        color = '#ef4444'; // Red
    } else if (bmi < th_over) {
        category = 'Optimal / Healthy';
        color = '#22d3ee'; // Cyan (Neon)
    } else if (bmi < th_obese) {
        category = 'Overweight / Moderate Risk';
        color = '#facc15'; // Yellow
    } else {
        category = 'Obese / High Risk';
        color = '#f472b6'; // Pink/Red
    }

    return {
        category,
        color,
        minHealthyKPI: th_under,
        maxHealthyKPI: th_over // The upper bound of healthy is the threshold for overweight
    };
};

/**
 * Helper to calculate full SBMI Result object
 */
export const calculateFullProfile = (
    age: number,
    gender: Gender,
    heightCm: number,
    weightKg: number,
    ethnicity: Ethnicity
): SBMIResult => {
    const bmi = calculateBMI(weightKg, heightCm);
    const std = getStandardCategory(bmi);
    const sbmi = getSBMIInterpretation(bmi, age, ethnicity);

    const heightM = heightCm / 100;
    const minHealthyWeight = Number((sbmi.minHealthyKPI * heightM * heightM).toFixed(1));
    const maxHealthyWeight = Number((sbmi.maxHealthyKPI * heightM * heightM).toFixed(1));

    return {
        bmi,
        sbmiCategory: sbmi.category,
        sbmiColor: sbmi.color,
        standardCategory: std.category,
        standardColor: std.color,
        minHealthyWeight,
        maxHealthyWeight,
        timestamp: Date.now()
    };
};
