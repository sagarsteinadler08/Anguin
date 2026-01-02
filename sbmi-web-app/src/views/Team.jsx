import React from 'react';

function TeamView() {
    const team = [
        "Nane Aleksanyan", "Gevorg Harutyunyan", "Parvathy Velakketh Ajayagosh",
        "Abdullasiyad Thoppil", "Giorgi Andriashvili", "Mohammad Rashid Kannachenthodi",
        "Aneeshya Dasappan", "Rehaan Rithwan", "Leo Thomas"
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="glass-panel p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Project Team</h2>
                <p className="text-gray-600 mb-6">Advanced SBMI Calculator Project</p>

                <div className="inline-block text-left bg-white/40 p-6 rounded-2xl mb-8">
                    <h3 className="text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">Team Lead</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👨‍💻</div>
                        <div>
                            <p className="font-bold text-gray-800">Sagar Bhadravathi Ravi</p>
                            <p className="text-sm text-pink-600">sagar.bhadravathi.ravi.oxk@whz.de</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                    {team.map((member, i) => (
                        <div key={i} className="bg-white/30 p-4 rounded-xl flex items-center gap-3 hover:bg-white/60 transition cursor-default">
                            <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {member.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-700 text-sm">{member}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TeamView;
