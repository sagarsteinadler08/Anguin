import React, { useEffect } from 'react';
import { useSBMIStore } from '../../store/useSBMIStore';
import { motion, AnimatePresence } from 'framer-motion';

export const SbmIResultsCard: React.FC = () => {
    const { result, profile } = useSBMIStore();

    if (!result) {
        return (
            <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse mb-4"></div>
                <h3 className="text-xl font-bold text-gray-400">Waiting for Data...</h3>
                <p className="text-gray-500 text-sm mt-2">Enter your details to generate your Smart BMI analysis.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden h-full flex flex-col justify-center">
            {/* Glow Background based on result color */}
            <div
                className="absolute top-0 right-0 w-[300px] h-[300px] blur-[100px] opacity-20 pointer-events-none rounded-full"
                style={{ backgroundColor: result.sbmiColor }}
            ></div>

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={result.timestamp} // Re-animate on new result
                    className="text-center"
                >
                    <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">SBMI / Smart Score</span>

                    <h1
                        className="text-[5rem] font-black leading-none my-2 tracking-tighter"
                        style={{
                            background: `linear-gradient(135deg, white 0%, ${result.sbmiColor} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: `0 0 30px ${result.sbmiColor}40`
                        }}
                    >
                        {result.bmi.toFixed(1)}
                    </h1>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: result.sbmiColor, boxShadow: `0 0 10px ${result.sbmiColor}` }}></div>
                        <span className="font-bold" style={{ color: result.sbmiColor }}>{result.sbmiCategory}</span>
                    </div>

                    {/* THE USER REQUESTED ANIMATION: Pure CSS Version (via Tailwind config 'sbmi-pulse') */}
                    <p className="mt-6 text-gray-400 font-medium text-sm animate-sbmi-pulse">
                        Smart BMI score based on your age, gender and {profile.ethnicity} context
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-brand-dark/40 rounded-xl p-4 border border-white/5">
                            <span className="block text-xs text-gray-500 mb-1">Healthy Range (SBMI)</span>
                            <span className="text-lg font-semibold text-white">{result.minHealthyWeight} - {result.maxHealthyWeight} kg</span>
                        </div>
                        <div className="bg-brand-dark/40 rounded-xl p-4 border border-white/5">
                            <span className="block text-xs text-gray-500 mb-1">Standard BMI</span>
                            <span className="text-lg font-semibold" style={{ color: result.standardColor }}>{result.standardCategory}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
