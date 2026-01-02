import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ethnicity, Gender, HistoryEntry, SBMIResult, UnitSystem, UserProfile } from '../types';
import { calculateFullProfile } from '../utils/sbmi';
import { v4 as uuidv4 } from 'uuid'; // We won't install uuid, just use simple random string for now to save deps

const generateId = () => Math.random().toString(36).substr(2, 9);

interface SBMIState {
    profile: UserProfile;
    result: SBMIResult | null;
    history: HistoryEntry[];

    // Actions
    updateProfile: (updates: Partial<UserProfile>) => void;
    calculate: () => void;
    clearHistory: () => void;
    deleteHistoryEntry: (id: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
    age: 25,
    gender: 'Male',
    height: 170,
    weight: 70,
    ethnicity: 'White / European',
    dietHistory: 'No, never',
    unitSystem: 'Metric',
};

export const useSBMIStore = create<SBMIState>()(
    persist(
        (set, get) => ({
            profile: DEFAULT_PROFILE,
            result: null,
            history: [],

            updateProfile: (updates) => {
                set((state) => ({
                    profile: { ...state.profile, ...updates }
                }));
                // Auto-calculate on change? Maybe optional. User asked for "Goal Simulator" slider to see update immediately.
                // For the main form, let's keep it explicit or auto.
                // Let's NOT auto-calculate main result to keep the "Calculate" button meaningful, 
                // BUT we can use a separate hook for the simulator.
                // Actually, for a really "Advanced" app, auto-calc is better UX.
                // Let's auto-calculate on update.
                get().calculate();
            },

            calculate: () => {
                const { profile } = get();
                if (profile.height <= 0 || profile.weight <= 0) return;

                const result = calculateFullProfile(
                    profile.age,
                    profile.gender,
                    profile.height,
                    profile.weight,
                    profile.ethnicity
                );

                set({ result });

                // We generally don't save to history on EVERY keystroke. 
                // We should have a specific "Save" action or only save when "Calculate" button is clicked explicitly.
                // Refactoring: "updateProfile" just updates state. "calculate" updates result. 
                // Ideally we Separate "setProfile" from "commitCalculation".
            },

            // Explicit action to "Commit" the calculation to history
            saveToHistory: () => {
                const { result, profile } = get();
                if (!result) return;

                const entry: HistoryEntry = {
                    ...result,
                    id: generateId(),
                    profileSnapshot: { ...profile }
                };

                set((state) => ({
                    history: [entry, ...state.history]
                }));
            },

            clearHistory: () => set({ history: [] }),
            deleteHistoryEntry: (id) => set((state) => ({
                history: state.history.filter(h => h.id !== id)
            })),
        }),
        {
            name: 'sbmi-storage',
        }
    )
);
