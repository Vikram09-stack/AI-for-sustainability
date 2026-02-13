import React, { useState } from 'react';
import { Zap, Sun, Wind, Battery, AlertTriangle, Lightbulb } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const hourlyData = [
    { time: '00:00', usage: 12 }, { time: '04:00', usage: 8 },
    { time: '08:00', usage: 45 }, { time: '12:00', usage: 65 },
    { time: '16:00', usage: 55 }, { time: '20:00', usage: 78 },
    { time: '23:59', usage: 30 },
];

const peakData = [
    { device: 'HVAC', value: 45, color: '#f59e0b' },
    { device: 'Lighting', value: 25, color: '#fbbf24' },
    { device: 'Computers', value: 20, color: '#10b981' },
    { device: 'Other', value: 10, color: '#94a3b8' },
];

export default function Energy() {
    const [buildingType, setBuildingType] = useState('Office');
    const [operatingHours, setOperatingHours] = useState(10);
    const [lightingLevel, setLightingLevel] = useState(80);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex gap-4 items-center w-full md:w-auto">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Facility Optimization</h2>
                        <p className="text-sm text-gray-500">Manage consumption & set targets</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full md:w-2/3">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Building Type</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-amber-500 transition-colors"
                            value={buildingType}
                            onChange={(e) => setBuildingType(e.target.value)}
                        >
                            <option>Office</option>
                            <option>Campus</option>
                            <option>Home</option>
                        </select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-700">Operating Hours</label>
                            <span className="text-sm font-bold text-amber-600">{operatingHours}h</span>
                        </div>
                        <input
                            type="range" min="0" max="24"
                            className="w-full accent-amber-500"
                            value={operatingHours}
                            onChange={(e) => setOperatingHours(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-700">Lighting</label>
                            <span className="text-sm font-bold text-amber-600">{lightingLevel}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            className="w-full accent-amber-500"
                            value={lightingLevel}
                            onChange={(e) => setLightingLevel(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-soft border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Energy Consumption Profile</h3>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-500">Today</span>
                            <span className="text-xs px-2 py-1 hover:bg-gray-100 rounded-md text-gray-400 cursor-pointer">Week</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: 'none' }} />
                                <Area type="monotone" dataKey="usage" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Peak Alert Overlay */}
                    <div className="absolute top-20 right-6 bg-red-50 border border-red-100 p-3 rounded-xl shadow-sm max-w-[200px] animate-pulse">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-red-700">Peak Alert</h4>
                                <p className="text-[10px] text-red-600 mt-1">High usage detected 7-9 PM. Consider reducing HVAC load.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Breakdown & Renewable */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Device Breakdown</h3>
                        <div className="h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakData} layout="vertical" barSize={10} margin={{ left: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="device" type="category" width={70} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {peakData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold flex items-center gap-2">
                                <Sun className="w-5 h-5" /> Renewable Potential
                            </h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2"><Sun className="w-4 h-4 opacity-80" /> Solar Panel</span>
                                    <span className="font-bold">+45 kWh/day</span>
                                </div>
                                <div className="w-full bg-white/20 h-1.5 rounded-full">
                                    <div className="bg-yellow-300 h-full w-[70%] rounded-full"></div>
                                </div>
                                <p className="text-xs opacity-90 pt-2">Installing solar windows could reduce your grid reliance by <span className="font-bold">35%</span>.</p>
                            </div>
                        </div>

                        {/* Decorative Background Icons */}
                        <Wind className="absolute -bottom-6 -right-6 w-32 h-32 text-white opacity-10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
