import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen text-white font-sans selection:bg-neon-cyan selection:text-brand-dark">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-purple to-brand-dark"></div>
                {/* Glow Effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse-glow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>

            <Navbar />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <Outlet />
            </main>
        </div>
    );
};
