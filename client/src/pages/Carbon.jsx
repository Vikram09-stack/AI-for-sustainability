import React, { useState } from 'react';
import { Leaf, Award, PieChart as PieIcon, ArrowRight, RefreshCw, Car, Zap, ShoppingBag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Mobility', value: 45, color: '#3b82f6' }, // Blue
    { name: 'Energy', value: 30, color: '#f59e0b' },  // Amber
    { name: 'Consumption', value: 15, color: '#10b981' }, // Emerald
    { name: 'Other', value: 10, color: '#64748b' },    // Slate
];

const simulations = [
    { id: 'ev', label: 'Switch to EV', savings: 120, active: false },
    { id: 'solar', label: 'Install Solar', savings: 85, active: false },
    { id: 'vegan', label: 'Plant-based Diet', savings: 40, active: false },
];

export default function Carbon() {
    const [activeSims, setActiveSims] = useState([]);

    const toggleSim = (id) => {
        if (activeSims.includes(id)) {
            setActiveSims(activeSims.filter(s => s !== id));
        } else {
            setActiveSims([...activeSims, id]);
        }
    };

    const baseFootprint = 8.5; // tons
    const projectedSavings = activeSims.reduce((acc, id) => {
        const sim = simulations.find(s => s.id === id);
        return acc + (sim ? sim.savings / 1000 : 0);
    }, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-emerald-900 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-gray-300 font-medium mb-1">Total Carbon Footprint</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold tracking-tight">{baseFootprint - projectedSavings}</span>
                                <span className="text-xl text-emerald-400 font-medium">tons CO₂e</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                {projectedSavings > 0 ? (
                                    <span className="text-emerald-400 flex items-center gap-1">
                                        <ArrowRight className="w-4 h-4" /> Saving {projectedSavings.toFixed(2)} tons with simulations
                                    </span>
                                ) : (
                                    "Yearly Estimate"
                                )}
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2 text-gray-300">
                                <span>Score: Excellent</span>
                                <span>Top 10%</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[90%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">What-If Simulation</h3>
                    </div>

                    <div className="space-y-3 flex-1">
                        {simulations.map((sim) => (
                            <div
                                key={sim.id}
                                onClick={() => toggleSim(sim.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${activeSims.includes(sim.id)
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${activeSims.includes(sim.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                                        }`}>
                                        {activeSims.includes(sim.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className={`font-medium ${activeSims.includes(sim.id) ? 'text-emerald-900' : 'text-gray-700'}`}>
                                        {sim.label}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600">-{sim.savings} kg</span>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                        Apply to Plan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2">Emission Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Top Recommendations</h3>
                    <div className="space-y-4">
                        {[
                            { title: 'Switch to EV commuting', impact: 'High', savings: '1.2t', icon: Car, color: 'bg-blue-500' },
                            { title: 'Optimize HVAC Schedule', impact: 'Medium', savings: '0.5t', icon: Zap, color: 'bg-amber-500' },
                            { title: 'Reduce Plastic Consumption', impact: 'Low', savings: '0.1t', icon: ShoppingBag, color: 'bg-rose-500' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                                <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                                    <item.icon className={`w-5 h-5 ${item.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-600' :
                                                item.impact === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                            }`}>{item.impact} Impact</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg text-emerald-600">-{item.savings}</div>
                                    <div className="text-xs text-gray-400">CO₂e / yr</div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
