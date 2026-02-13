import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, Users, Leaf, DollarSign, Map as MapIcon, ChevronRight, Trees } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { simulateEnergy, getOptimizationSuggestions } from '../services/api';

const MOCK_DATA = [
    { time: '00:00', consumption: 45, prediction: 48 },
    { time: '04:00', consumption: 30, prediction: 32 },
    { time: '08:00', consumption: 120, prediction: 115 },
    { time: '12:00', consumption: 150, prediction: 145 },
    { time: '16:00', consumption: 140, prediction: 142 },
    { time: '20:00', consumption: 90, prediction: 95 },
    { time: '23:59', consumption: 55, prediction: 60 },
];

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scenario, setScenario] = useState('baseline'); // 'baseline', 'ev_adoption', 'wfh'
    const [suggestions, setSuggestions] = useState([]);
    const [stats, setStats] = useState({ co2: '12.5 kg', energy: '15%', score: '85/100', cost: '$34.20' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            // 1. Simulate Energy Data based on Scenario
            let params = { building_type: 'office', hours: 10, lighting: 80 };

            if (scenario === 'ev_adoption') {
                params.hours = 12; // Charging increases load time
                setStats(prev => ({ ...prev, co2: '18.2 kg', cost: '$42.50' })); // Mock update
            } else if (scenario === 'wfh') {
                params.hours = 6; // Reduced office hours
                params.lighting = 40;
                setStats(prev => ({ ...prev, co2: '8.1 kg', cost: '$22.10', score: '92/100' }));
            } else {
                setStats({ co2: '12.5 kg', energy: '15%', score: '85/100', cost: '$34.20' });
            }

            try {
                const eData = await simulateEnergy(params);

                if (eData && eData.hourly_usage && eData.hourly_usage.length > 0) {
                    const formattedData = eData.hourly_usage.map(item => ({
                        time: item.time,
                        consumption: item.usage,
                        prediction: item.usage * 1.05 // Mock prediction
                    }));
                    setData(formattedData);

                    // 2. Get AI Suggestions
                    const ai_result = await getOptimizationSuggestions({
                        consumption: eData.total_daily_kwh,
                        hour: new Date().getHours()
                    });
                    if (ai_result) setSuggestions(ai_result);
                } else {
                    console.warn("API returned no data, using mock data");
                    setData(MOCK_DATA);
                    setSuggestions([
                        { type: 'success', message: 'Lighting optimization active', potential_savings: '12%' },
                        { type: 'warning', message: 'High HVAC usage detected', potential_savings: '8%' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setData(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [scenario]);

    if (loading && data.length === 0) return (
        <div className="flex justify-center items-center py-20 min-h-screen bg-slate-900 text-white">
            <div className="animate-pulse text-emerald-400 font-semibold text-lg">Loading UrbanMind Dashboard...</div>
        </div>
    );

    return (
        <div
            className="w-screen min-h-screen relative left-[calc(-50vw+50%)] -mt-8 -mb-8 bg-cover bg-center bg-fixed overflow-x-hidden"
            style={{ backgroundImage: "url('/images/dashboard.jpg')" }}
        >
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px] z-0"></div>

            {/* Floating Leaves Animation */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={`leaf-${i}`}
                        initial={{
                            y: "110vh",
                            x: Math.random() * window.innerWidth,
                            opacity: 0
                        }}
                        animate={{
                            y: "-10vh",
                            x: Math.random() * window.innerWidth,
                            opacity: [0, 0.8, 0],
                            rotate: 360
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            delay: -1 * Math.random() * 35, // Negative delay to start mid-animation
                            ease: "linear"
                        }}
                        className="absolute w-8 h-8 text-emerald-300/60 drop-shadow-lg"
                        style={{
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.6 + 0.9
                        }}
                    >
                        <Leaf className="w-full h-full" />
                    </motion.div>
                ))}

                {/* Floating Trees Animation (Left Side) */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`tree-left-${i}`}
                        initial={{
                            y: "110vh",
                            x: Math.random() * (window.innerWidth * 0.2),
                            opacity: 0
                        }}
                        animate={{
                            y: "-10vh",
                            x: Math.random() * (window.innerWidth * 0.2),
                            opacity: [0, 0.9, 0],
                            rotate: 10
                        }}
                        transition={{
                            duration: 20 + Math.random() * 25,
                            repeat: Infinity,
                            delay: -1 * Math.random() * 45, // Negative delay
                            ease: "linear"
                        }}
                        className="absolute w-12 h-12 text-emerald-500/50 drop-shadow-xl"
                        style={{
                            left: `${Math.random() * 20}%`,
                            scale: Math.random() * 0.8 + 1.2
                        }}
                    >
                        <Trees className="w-full h-full" />
                    </motion.div>
                ))}

                {/* Floating Trees Animation (Right Side) */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`tree-right-${i}`}
                        initial={{
                            y: "110vh",
                            x: window.innerWidth - (Math.random() * (window.innerWidth * 0.2)),
                            opacity: 0
                        }}
                        animate={{
                            y: "-10vh",
                            x: window.innerWidth - (Math.random() * (window.innerWidth * 0.2)),
                            opacity: [0, 0.9, 0],
                            rotate: -10
                        }}
                        transition={{
                            duration: 20 + Math.random() * 25,
                            repeat: Infinity,
                            delay: -1 * Math.random() * 45, // Negative delay
                            ease: "linear"
                        }}
                        className="absolute w-12 h-12 text-emerald-500/50 drop-shadow-xl"
                        style={{
                            left: `${80 + Math.random() * 20}%`,
                            scale: Math.random() * 0.8 + 1.2
                        }}
                    >
                        <Trees className="w-full h-full" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header & Scenario Toggle */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                    <div>
                        <h2 className="text-3xl font-bold text-white drop-shadow-md">Overview</h2>
                        <p className="text-slate-200 font-medium">Your sustainability status at a glance.</p>
                    </div>
                    <div className="flex bg-white/20 p-1 rounded-lg border border-white/10 shadow-inner backdrop-blur-sm">
                        <button
                            onClick={() => setScenario('baseline')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${scenario === 'baseline' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setScenario('ev_adoption')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${scenario === 'ev_adoption' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            EV Adoption
                        </button>
                        <button
                            onClick={() => setScenario('wfh')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${scenario === 'wfh' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            WFH Impact
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="CO₂ Saved Today"
                        value={stats.co2}
                        icon={Leaf}
                        color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        trend="+5% vs yesterday"
                        trendColor="text-emerald-300"
                    />
                    <StatCard
                        title="Energy Saved"
                        value={stats.energy}
                        icon={Zap}
                        color="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        trend="Optimization active"
                        trendColor="text-yellow-300"
                    />
                    <StatCard
                        title="Sustainability Score"
                        value={stats.score}
                        icon={Activity}
                        color="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        trend="Top 10% of city"
                        trendColor="text-blue-300"
                    />
                    <StatCard
                        title="Cost Saved"
                        value={stats.cost}
                        icon={DollarSign}
                        color="bg-purple-500/20 text-purple-400 border-purple-500/30"
                        trend="This week"
                        trendColor="text-purple-300"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Col: Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Energy Consumption</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-slate-200/80 text-slate-600 rounded">Today</span>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
                                        <Line type="monotone" dataKey="consumption" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="prediction" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 text-slate-800">Weekly Carbon Emissions</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.slice(0, 7)}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
                                        <Bar dataKey="consumption" fill="#475569" radius={[6, 6, 0, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Map & Suggestions */}
                    <div className="space-y-6">
                        {/* Mini Map */}
                        <div className="bg-white/80 p-2 rounded-2xl border border-white/40 shadow-xl overflow-hidden h-64 relative z-0 backdrop-blur-xl">
                            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-200/50">
                                Current Route Preview
                            </div>
                            <MapContainer
                                center={[51.505, -0.09]}
                                zoom={13}
                                style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                                zoomControl={false}
                                attributionControl={false}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                <Marker position={[51.505, -0.09]}>
                                    <Popup>Your Location</Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        {/* AI Suggestions Panel */}
                        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/30 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                <Zap className="w-5 h-5 text-emerald-400" /> AI Suggestions
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {suggestions.length > 0 ? suggestions.map((s, i) => (
                                    <SuggestionItem
                                        key={i}
                                        type={s.type || (s.action === 'Load Shifting' ? 'warning' : 'success')}
                                        text={s.message}
                                        subtext={s.potential_savings ? `Save ${s.potential_savings}` : 'Optimization opportunity'}
                                    />
                                )) : (
                                    <div className="text-slate-400 text-sm">All systems optimized.</div>
                                )}
                            </div>
                            <button className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-semibold flex items-center justify-center border border-white/5 active:scale-95">
                                View All Suggestions <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, trendColor }) => (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1 drop-shadow-sm">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl border backdrop-blur-sm ${color} transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <div className={`text-xs font-semibold ${trendColor || 'text-slate-300'} flex items-center gap-1`}>
            {trend}
        </div>
    </div>
);

const SuggestionItem = ({ type, text, subtext }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
        <div className={`w-2 h-2 mt-2 rounded-full shadow-[0_0_8px] ${type === 'success' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-amber-400 shadow-amber-400/50'}`} />
        <div>
            <p className="text-sm font-medium text-slate-100 leading-snug">{text}</p>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
    </div>
);

export default Dashboard;
