import React, { useState } from 'react';
import { Calculator, LineChart, Activity, Info, Menu, User } from 'lucide-react';
import CalculatorView from './views/Calculator';
import InsightsView from './views/Insights';
import HistoryView from './views/History';
import TeamView from './views/Team';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('calc');
  const [userProfile, setUserProfile] = useState({
    units: 'Metric', // or 'Imperial'
    age: 25,
    gender: 'Male',
    height: 170, // cm
    weight: 70, // kg
    isAsian: false,
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'calc': return <CalculatorView profile={userProfile} setProfile={setUserProfile} />;
      case 'insights': return <InsightsView profile={userProfile} />;
      case 'history': return <HistoryView />;
      case 'team': return <TeamView />;
      default: return <CalculatorView profile={userProfile} setProfile={setUserProfile} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === id
          ? 'text-primary bg-white/20 font-bold'
          : 'text-gray-500 hover:text-gray-700'
        }`}
      style={{ color: activeTab === id ? 'var(--color-primary)' : 'var(--text-muted)' }}
    >
      <Icon size={24} />
      <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Top Bar */}
      <nav className="glass-panel sticky top-4 mx-4 my-4 p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
            🧬
          </div>
          <h1 className="font-bold text-xl text-gradient hidden md:block">Advanced SBMI</h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4">
          <button onClick={() => setActiveTab('calc')} className={activeTab === 'calc' ? 'font-bold text-pink-600' : ''}>Calculator</button>
          <button onClick={() => setActiveTab('insights')} className={activeTab === 'insights' ? 'font-bold text-pink-600' : ''}>Insights</button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'font-bold text-pink-600' : ''}>History</button>
          <button onClick={() => setActiveTab('team')} className={activeTab === 'team' ? 'font-bold text-pink-600' : ''}>Team</button>
        </div>

        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-black/5"><User size={20} /></button>
          <button className="p-2 rounded-full hover:bg-black/5"><Menu size={20} /></button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass-panel fixed bottom-4 left-4 right-4 p-2 flex justify-around items-center md:hidden z-50">
        <NavItem id="calc" icon={Calculator} label="Calc" />
        <NavItem id="insights" icon={Activity} label="Insights" />
        <NavItem id="history" icon={LineChart} label="History" />
        <NavItem id="team" icon={Info} label="Team" />
      </nav>
    </div>
  );
}

export default App;
