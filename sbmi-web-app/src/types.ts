export type Gender = 'Male' | 'Female';
export type UnitSystem = 'Metric' | 'Imperial';
export type Ethnicity = 'White / European' | 'South Asian' | 'Black' | 'Chinese' | 'Arab' | 'Other / Mixed' | 'Asian (Other)';
export type DietHistory = 'No, never' | 'More than a year ago' | 'For a few months in the past' | 'Yes, currently';

export interface UserProfile {
    age: number;
    gender: Gender;
    height: number; // in cm
    weight: number; // in kg
    ethnicity: Ethnicity;
    dietHistory: DietHistory;
    unitSystem: UnitSystem;
    activityLevel?: string;
    targetWeight?: number; // in kg
}

export interface SBMIResult {
    bmi: number;
    sbmiCategory: string;
    sbmiColor: string;
    standardCategory: string;
    standardColor: string;
    minHealthyWeight: number; // kg
    maxHealthyWeight: number; // kg
    timestamp: number;
}

export interface HistoryEntry extends SBMIResult {
    id: string;
    profileSnapshot: UserProfile;
}
