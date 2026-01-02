import React from 'react';
import { useSBMIStore } from '../store/useSBMIStore';
import { Trash2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
    const { history, clearHistory, deleteHistoryEntry } = useSBMIStore();

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📜</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-300">No History Yet</h2>
                <p className="text-gray-500 mt-2">Calculations you save will appear here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Calculation History</h1>
                <button
                    onClick={clearHistory}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-4">
                {history.map((entry) => (
                    <div key={entry.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between group">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-2xl font-bold" style={{ color: entry.sbmiColor }}>
                                    {entry.bmi}
                                </span>
                                <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-bold uppercase tracking-wide">
                                    {entry.sbmiCategory}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {new Date(entry.timestamp).toLocaleDateString()} • {entry.profileSnapshot.ethnicity} • {entry.profileSnapshot.height}cm / {entry.profileSnapshot.weight}kg
                            </p>
                        </div>
                        <button
                            onClick={() => deleteHistoryEntry(entry.id)}
                            className="p-2 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
