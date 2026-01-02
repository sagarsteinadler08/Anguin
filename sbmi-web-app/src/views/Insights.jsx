import React from 'react';

function InsightsView({ profile }) {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Hero Card */}
            <div className="glass-panel p-8 bg-gradient-to-r from-violet-500/10 to-pink-500/10">
                <h2 className="text-2xl font-bold mb-4">Why Smart BMI?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Standard BMI is a useful screening tool but has limitations. It doesn't account for age,
                    ethnicity, or gender differences in body composition. <strong>SBMI</strong> applies targeted adjustments
                    derived from global health data (WHO/Lancet).
                </p>
            </div>

            {/* Adjustments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`glass-panel p-6 ${profile.isAsian ? 'border-pink-300 ring-2 ring-pink-200' : ''}`}>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        🌏 Asian Ethnicity Adjustment
                        {profile.isAsian && <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">Active</span>}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                        <li>Overweight threshold lowered to <strong>23.0</strong></li>
                        <li>Obese threshold lowered to <strong>27.5</strong></li>
                        <li>Accounts for higher visceral fat risk at lower weights.</li>
                    </ul>
                </div>

                <div className={`glass-panel p-6 ${profile.age >= 65 ? 'border-pink-300 ring-2 ring-pink-200' : ''}`}>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        👴 Age Adjustment (65+)
                        {profile.age >= 65 && <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">Active</span>}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                        <li>Healthy minimum raised to <strong>22.0</strong></li>
                        <li>Higher weight reserves protect against frailty.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default InsightsView;
