import React from 'react';

export const InsightsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass-panel p-8 rounded-3xl">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple mb-4">
                    Why Smart BMI?
                </h1>
                <p className="text-gray-300 leading-relaxed text-lg">
                    Traditional BMI is a simple calculation of weight divided by height. While useful for general populations, it fails to account for
                    critical biological differences. **Smart BMI (SBMI)** introduces advanced contextual scaling based on:
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-neon-cyan font-bold text-xl mb-2">Age</h3>
                        <p className="text-sm text-gray-400">
                            As we age, muscle mass naturally decreases and bone density changes. SBMI adjusts healthy weight ranges upwards for seniors to protect against frailty.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-neon-purple font-bold text-xl mb-2">Ethnicity</h3>
                        <p className="text-sm text-gray-400">
                            Research (Lancet 2021) shows South Asian, Chinese, and Black populations face diabetes risks at lower BMIs than White populations. SBMI strictly lowers thresholds for these groups.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-white font-bold text-xl mb-2">Gender</h3>
                        <p className="text-sm text-gray-400">
                            Men and women carry fat differently. SBMI accounts for these physiological differences in its risk assessment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
