import React from 'react';
import { Trash2 } from 'lucide-react';

function HistoryView() {
    // Mock Data
    const logs = [
        { date: '2025-12-28', bmi: 24.2, sbmi: 'Optimal', weight: 70 },
        { date: '2025-12-20', bmi: 24.5, sbmi: 'Optimal', weight: 71.5 },
        { date: '2025-11-15', bmi: 25.1, sbmi: 'Overweight', weight: 73 },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Health Trends</h2>
                <button className="text-red-500 text-sm flex items-center gap-1 opacity-70 hover:opacity-100 transition">
                    <Trash2 size={16} /> Clear History
                </button>
            </div>

            {/* Chart (Mock Visual) */}
            <div className="glass-panel p-6 h-64 flex items-end justify-between gap-2">
                {[60, 65, 55, 70, 68, 75, 72].map((h, i) => (
                    <div key={i} className="w-full bg-pink-200/50 rounded-t-lg relative group transition-all hover:bg-pink-400" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                            BMI 24.{h % 10}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logs */}
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-pink-50/50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Weight</th>
                            <th className="p-4">BMI</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log, i) => (
                            <tr key={i} className="hover:bg-white/40 transition">
                                <td className="p-4 text-gray-600 font-medium">{log.date}</td>
                                <td className="p-4">{log.weight} kg</td>
                                <td className="p-4 font-bold text-gray-800">{log.bmi}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.sbmi === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {log.sbmi}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryView;
