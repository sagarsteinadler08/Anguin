export const convertHeightToMeters = (feet, inches = 0, cm = 0, system = "Metric") => {
    if (system === "Metric") {
        return cm / 100.0;
    } else {
        // 1 ft = 0.3048 m, 1 in = 0.0254 m
        return (feet * 0.3048) + (inches * 0.0254);
    }
};

export const convertWeightToKg = (weightVal, weightVal2 = 0, unit = "kg") => {
    if (unit === "kg") {
        return weightVal;
    } else if (unit === "lb") {
        return weightVal * 0.453592;
    } else if (unit === "st") {
        // 1 stone = 6.35029 kg, 1 lb = 0.453592 kg
        return (weightVal * 6.35029) + (weightVal2 * 0.453592);
    }
    return weightVal;
};

export const calculateBMI = (weightKg, heightM) => {
    if (heightM <= 0) return 0;
    return weightKg / (heightM ** 2);
};

export const getStandardCategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3498db" }; // Blue
    else if (bmi < 24.9) return { category: "Healthy Weight", color: "#10b981" }; // Green
    else if (bmi < 29.9) return { category: "Overweight", color: "#f59e0b" }; // Amber
    else return { category: "Obese", color: "#ef4444" }; // Red
};

export const getSbmiInterpretation = (bmi, age, gender, isAsian) => {
    let th_under = 18.5;
    let th_over = 25.0;
    let th_obese = 30.0;

    // 1. Ethnicity Adjustment
    if (isAsian) {
        th_over = 23.0;
        th_obese = 27.5;
    }

    // 2. Age Adjustment
    if (age >= 65) {
        th_under = 22.0;
        th_over = 27.0;

        if (isAsian) {
            th_over = 24.0;
            th_obese = 28.0;
        }
    }

    let category = "";
    let color = "";

    if (bmi < th_under) {
        category = "Underweight / Frailty Risk";
        color = "#f97316"; // Orange
    } else if (bmi < th_over) {
        category = "Optimal / Healthy";
        color = "#10b981"; // Green
    } else if (bmi < th_obese) {
        category = "Overweight";
        color = "#f59e0b"; // Amber
    } else {
        category = "Obese";
        color = "#ef4444"; // Red
    }

    return { category, color, range: [th_under, th_over] };
};
