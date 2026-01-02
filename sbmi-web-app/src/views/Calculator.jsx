import React, { useState, useEffect } from 'react';
import { calculateBMI, getStandardCategory, getSbmiInterpretation, convertHeightToMeters, convertWeightToKg } from '../utils/sbmi';

function CalculatorView({ profile, setProfile }) {
    const [result, setResult] = useState(null);

    // Constants
    const MIN_WEIGHT = 30;
    const MAX_WEIGHT = 200;
    const MIN_HEIGHT = 100;
    const MAX_HEIGHT = 250;

    // Real-time calculation effect
    useEffect(() => {
        let h_m = profile.height / 100;
        if (profile.units === 'Imperial') {
            // Simple conversion for slider visualization logic -> stored as metric in profile for simplicity? 
            // Actually for this demo let's stick to profile having "metric" values as source of truth
            // and just displaying them differently if we want deep imperial support. 
            // For now, let's keep it simple: profile stores raw metric values used by logic.
        }

        // Calculate
        const bmi = calculateBMI(profile.weight, profile.height / 100);
        const std = getStandardCategory(bmi);
        const sbmi = getSbmiInterpretation(bmi, profile.age, profile.gender, profile.isAsian);

        // Ideal Range
        const minW = sbmi.range[0] * (h_m * h_m);
        const maxW = sbmi.range[1] * (h_m * h_m);

        setResult({ bmi, std, sbmi, idealRange: [minW, maxW] });
    }, [profile]);

    const handleSliderChange = (key, val) => {
        setProfile(prev => ({ ...prev, [key]: parseFloat(val) }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* INPUT PANEL */}
            <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Your Profile</h2>
                    <div className="bg-white/50 p-1 rounded-lg flex gap-1 text-sm">
                        <button
                            onClick={() => handleSliderChange('units', 'Metric')}
                            className={`px-3 py-1 rounded-md transition ${profile.units === 'Metric' ? 'bg-white shadow text-pink-600 font-bold' : 'text-gray-500'}`}
                        >Metric</button>
                        <button
                            onClick={() => handleSliderChange('units', 'Imperial')} // Just UI toggle for now
                            className={`px-3 py-1 rounded-md transition ${profile.units === 'Imperial' ? 'bg-white shadow text-pink-600 font-bold' : 'text-gray-500'}`}
                        >Imp</button>
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                    {/* Height */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-600">Height</label>
                            <span className="font-bold text-pink-600">{profile.height} cm</span>
                        </div>
                        <input
                            type="range"
                            min={MIN_HEIGHT} max={MAX_HEIGHT}
                            value={profile.height}
                            onChange={(e) => handleSliderChange('height', e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-600">Weight</label>
                            <span className="font-bold text-pink-600">{profile.weight} kg</span>
                        </div>
                        <input
                            type="range"
                            min={MIN_WEIGHT} max={MAX_WEIGHT} step="0.5"
                            value={profile.weight}
                            onChange={(e) => handleSliderChange('weight', e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">Age</label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={(e) => handleSliderChange('age', e.target.value)}
                                className="w-full p-2 bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-2 block">Gender</label>
                            <select
                                value={profile.gender}
                                onChange={(e) => handleSliderChange('gender', e.target.value)}
                                className="w-full p-2 bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Context */}
                    <div className="pt-4 border-t border-gray-200/50">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={profile.isAsian}
                                onChange={(e) => setProfile(prev => ({ ...prev, isAsian: e.target.checked }))}
                                className="w-5 h-5 accent-pink-500 rounded focus:ring-pink-500"
                            />
                            <div>
                                <span className="font-semibold text-gray-700">Asian / Asian American</span>
                                <p className="text-xs text-gray-500">Adjusts thresholds for higher risk</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* RESULT PANEL */}
            <div className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                {result && (
                    <>
                        <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Your Smart BMI</h3>
                        <div
                            className="text-8xl font-black mb-4 tracking-tighter"
                            style={{
                                background: `-webkit-linear-gradient(45deg, ${result.sbmi.color}, #1f2937)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {result.bmi.toFixed(1)}
                        </div>

                        <div
                            className="px-6 py-2 rounded-full font-bold text-white shadow-lg mb-8 transform transition-all hover:scale-105"
                            style={{ backgroundColor: result.sbmi.color }}
                        >
                            {result.sbmi.category}
                        </div>

                        <div className="w-full bg-white/40 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 text-sm">Healthy Weight Range</span>
                                <span className="font-bold text-emerald-600">
                                    {result.idealRange[0].toFixed(1)} - {result.idealRange[1].toFixed(1)} kg
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Standard Category</span>
                                <span className="font-bold" style={{ color: result.std.color }}>
                                    {result.std.category}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CalculatorView;
