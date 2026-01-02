import React from 'react';
import { CalculatorForm } from '../components/calculators/CalculatorForm';
import { SbmIResultsCard } from '../components/calculators/SbmIResultsCard';
import { SBMITorus } from '../components/3d/SBMITorus';

export const CalculatorPage: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[85vh]">
            {/* Left Column: Form (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <CalculatorForm />
            </div>

            {/* Middle Column: 3D Visualization (4 cols) - Hidden on mobile, visible on desktop */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 pointer-events-none">
                    {/* Floating Title or decorative elements could go here */}
                </div>
                <SBMITorus />
            </div>

            {/* Right Column: Results (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <SbmIResultsCard />
            </div>

            {/* Mobile 3D Fallback (Visible only on small screens below form) */}
            <div className="col-span-1 lg:hidden h-[300px]">
                <SBMITorus />
            </div>
        </div>
    );
};
