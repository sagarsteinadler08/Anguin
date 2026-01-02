import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, History, Info, Users } from 'lucide-react';
import clsx from 'clsx';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            active
                ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
    >
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        <span className="font-medium text-sm">{label}</span>
    </Link>
);

export const Navbar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-4 z-50 px-4">
            <div className="max-w-4xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center text-brand-dark font-bold text-lg">
                        Y
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden sm:block">
                        Yos <span className="text-gray-400 font-normal">SBMI</span>
                    </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <NavItem to="/" icon={<Activity />} label="Calc" active={isActive('/')} />
                    <NavItem to="/insights" icon={<Info />} label="Insights" active={isActive('/insights')} />
                    <NavItem to="/history" icon={<History />} label="History" active={isActive('/history')} />
                </div>
            </div>
        </nav>
    );
};
