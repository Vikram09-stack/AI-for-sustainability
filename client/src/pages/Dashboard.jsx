import React from 'react';
import { Leaf, Zap, TrendingUp, ArrowRight, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 27 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 23 },
    { name: 'Sun', value: 34 },
];

const StatCard = ({ title, value, unit, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 card-hover group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {trend}
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>
    </div>
);

const ActivityItem = ({ icon: Icon, title, time, points, color }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className={`p-3 rounded-full ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-xs text-gray-500">{time}</p>
        </div>
        <span className="text-sm font-bold text-emerald-600">+{points} pts</span>
    </div>
);

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's your sustainability overview for today.</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-primary to-emerald-600 text-white rounded-full font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Run Simulation
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="CO₂ Saved" value="12.5" unit="kg" icon={Leaf} color="bg-emerald-500" trend="+12%" />
                <StatCard title="Energy Saved" value="145" unit="kWh" icon={Zap} color="bg-amber-500" trend="+5%" />
                <StatCard title="Money Saved" value="$42" unit="" icon={TrendingUp} color="bg-sky-500" trend="+8%" />

                {/* Sustainability Score */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg shadow-gray-200 text-white card-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h3 className="text-gray-300 text-sm font-medium">Sustainability Score</h3>
                        <div className="flex items-end gap-2 mt-2">
                            <span className="text-5xl font-bold">85</span>
                            <span className="text-lg text-emerald-400 font-medium mb-1">/100</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Top 5% of your city!</p>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-400 to-primary h-full w-[85%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Weekly Carbon Impact</h3>
                        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-1 focus:ring-primary focus:border-primary outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Recommendations & Map Preview */}
                <div className="space-y-6">
                    {/* Map Preview */}
                    <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Placeholder map bg */}
                        <div className="relative z-10 h-40 flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Current Route Preview
                            </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                            <div className="text-xs font-medium">Next Commute</div>
                            <div className="text-sm font-bold">Home to Office (Metro)</div>
                        </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-indigo-100 rounded-lg">
                                <Zap className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">AI Suggestions</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-sm text-gray-700"><span className="font-semibold text-emerald-700">Insight:</span> Switch to Metro tomorrow to save <span className="font-bold">2.4kg CO₂</span>.</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-sm text-gray-700"><span className="font-semibold text-amber-700">Alert:</span> High energy usage predicted between 7-9 PM.</p>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1 group">
                            View All Suggestions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
