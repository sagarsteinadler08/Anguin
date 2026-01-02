import React from 'react';
import { useSBMIStore } from '../../store/useSBMIStore';
import { Ethnicity, Gender } from '../../types';
import { Play } from 'lucide-react';
import clsx from 'clsx';

const ETHNICITY_OPTIONS: Ethnicity[] = [
    'White / European',
    'South Asian',
    'Black',
    'Chinese',
    'Arab',
    'Other / Mixed',
    'Asian (Other)'
];

export const CalculatorForm: React.FC = () => {
    const { profile, updateProfile, calculate } = useSBMIStore();

    const handleCalculate = () => {
        calculate();
    };

    return (
        <div className="glass-panel p-8 rounded-3xl h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-neon-cyan rounded-full"></span>
                Your Profile
            </h2>

            <div className="space-y-6">
                {/* Age & Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium ml-1">Age</label>
                        <input
                            type="number"
                            className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none focus:border-neon-cyan transition-colors"
                            value={profile.age}
                            onChange={(e) => updateProfile({ age: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium ml-1">Gender</label>
                        <select
                            className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none focus:border-neon-cyan transition-colors appearance-none"
                            value={profile.gender}
                            onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Ethnicity - Critical for SBMI */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium ml-1 flex justify-between">
                        Ethnicity
                        <span className="text-neon-cyan/80 text-xs">For Diabetes Risk Context</span>
                    </label>
                    <select
                        className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none focus:border-neon-cyan transition-colors"
                        value={profile.ethnicity}
                        onChange={(e) => updateProfile({ ethnicity: e.target.value as Ethnicity })}
                    >
                        {ETHNICITY_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Height & Weight Sliders */}
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm ml-1">
                            <span className="text-gray-400 font-medium">Height (cm)</span>
                            <span className="font-bold text-white">{profile.height} cm</span>
                        </div>
                        <input
                            type="range"
                            min="100" max="250"
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                            value={profile.height}
                            onChange={(e) => updateProfile({ height: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm ml-1">
                            <span className="text-gray-400 font-medium">Weight (kg)</span>
                            <span className="font-bold text-white">{profile.weight} kg</span>
                        </div>
                        <input
                            type="range"
                            min="30" max="200" step="0.5"
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                            value={profile.weight}
                            onChange={(e) => updateProfile({ weight: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleCalculate}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-brand-dark font-bold text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        Calculate SBMI
                        <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">
                        Using advanced algorithms based on Lancet 2021 & WHO data.
                    </p>
                </div>
            </div>
        </div>
    );
};
