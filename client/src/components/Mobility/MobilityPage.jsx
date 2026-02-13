import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Clock, CreditCard, Leaf, ArrowRight, Car, Bus, Train } from 'lucide-react';
import { calculateMobility, getMobilitySuggestions } from '../../services/api';

// Helper component to recenter map
const RecenterMap = ({ points }) => {
    const map = useMap();
    useEffect(() => {
        if (points && points.length >= 2) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
};

const MobilityPage = () => {
    const [start, setStart] = useState('Central Station');
    const [end, setEnd] = useState('Tech Park');
    const [transportType, setTransportType] = useState('car');
    const [loading, setLoading] = useState(false);
    const [bestOption, setBestOption] = useState(null);

    // AI Suggestions State
    const [suggestions, setSuggestions] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    // Route state
    const [routePoints, setRoutePoints] = useState([
        [28.6139, 77.2090], // Default: Delhi
        [19.0760, 72.8777]  // Default: Mumbai
    ]);

    // Comparison data state
    const [comparisons, setComparisons] = useState([
        { mode: 'car', label: 'Private Car', time: '--', cost: '--', co2: '--', icon: Car, color: 'text-red-400', bg: 'bg-red-500/20 ring-1 ring-red-500/30' },
        { mode: 'ev', label: 'EV Car', time: '--', cost: '--', co2: '--', icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-500/20 ring-1 ring-emerald-500/30' },
        { mode: 'metro', label: 'Metro', time: '--', cost: '--', co2: '--', icon: Train, color: 'text-blue-400', bg: 'bg-blue-500/20 ring-1 ring-blue-500/30' },
        { mode: 'bus', label: 'Bus', time: '--', cost: '--', co2: '--', icon: Bus, color: 'text-yellow-400', bg: 'bg-yellow-500/20 ring-1 ring-yellow-500/30' },
    ]);

    const handleCalculate = async () => {
        console.log("Starting calculation with:", { start, end });
        if (!start || !end) {
            alert("Please enter both start and destination locations.");
            return;
        }
        setLoading(true);

        try {
            let startCoords = null;
            let endCoords = null;

            const updatedComparisons = await Promise.all(comparisons.map(async (item) => {
                console.log(`Calculating for mode: ${item.mode}`);
                const result = await calculateMobility({
                    start,
                    end,
                    mode: item.mode
                });
                console.log(`Result for ${item.mode}:`, result);

                if (result) {
                    // Capture coordinates from the first successful result
                    if (!startCoords && result.start_coords) startCoords = result.start_coords;
                    if (!endCoords && result.end_coords) endCoords = result.end_coords;

                    return {
                        ...item,
                        time: result.time,
                        cost: result.cost,
                        co2: result.co2,
                        saved: result.saved_vs_car
                    };
                } else {
                    console.error(`Failed to get result for ${item.mode}`);
                    return { ...item, time: 'N/A', cost: 'N/A', co2: 'N/A' };
                }
            }));

            setComparisons(updatedComparisons);

            // Update map if coordinates were returned
            if (startCoords && endCoords) {
                console.log("Updating route points:", [startCoords, endCoords]);
                setRoutePoints([startCoords, endCoords]);
            }

            // Find best option
            let maxSaved = 0;
            let best = null;
            updatedComparisons.forEach(item => {
                if (item.saved && item.saved !== "0 kg") {
                    const val = parseFloat(item.saved.replace(' kg', ''));
                    if (val > maxSaved) {
                        maxSaved = val;
                        best = { ...item, savedVal: val };
                    }
                }
            });
            setBestOption(best);

            // Auto-fetch suggestions if calculation was successful
            if (best) {
                // We need to pass the most up-to-date data, so we can't use state immediately here for parameters
                // But we can call the async function with current local variables
                fetchSuggestions(start, end, updatedComparisons, best);
            }

        } catch (err) {
            console.error("Error in handleCalculate:", err);
            alert("An error occurred while calculating route data. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (currentStart = start, currentEnd = end, currentComparisons = comparisons, currentBest = bestOption) => {
        if (!currentBest) return;

        setAiLoading(true);
        try {
            const result = await getMobilitySuggestions({
                start: currentStart,
                end: currentEnd,
                comparisons: currentComparisons,
                bestOption: currentBest
            });

            if (result) {
                setSuggestions(result);
            }
        } catch (e) {
            console.error("Failed to fetch mobility suggestions", e);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div
            className="w-screen min-h-screen relative left-[calc(-50vw+50%)] -mt-8 -mb-8 bg-cover bg-center bg-fixed overflow-x-hidden"
            style={{ backgroundImage: "url('/images/mobility.jpg')" }}
        >
            {/* Floating Leaves Animation - Left Side */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`leaf-left-${i}`}
                        initial={{ y: "110vh", x: Math.random() * (window.innerWidth * 0.2), opacity: 0 }}
                        animate={{
                            y: "-10vh",
                            x: Math.random() * (window.innerWidth * 0.2),
                            opacity: [0, 0.8, 0],
                            rotate: 360
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            delay: -1 * Math.random() * 35,
                            ease: "linear"
                        }}
                        className="absolute w-8 h-8 text-emerald-600/40 drop-shadow-sm"
                        style={{
                            left: `${Math.random() * 20}%`,
                            scale: Math.random() * 0.6 + 0.9
                        }}
                    >
                        <Leaf className="w-full h-full" />
                    </motion.div>
                ))}

                {/* Floating Leaves Animation - Right Side */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`leaf-right-${i}`}
                        initial={{ y: "110vh", x: window.innerWidth - (Math.random() * (window.innerWidth * 0.2)), opacity: 0 }}
                        animate={{
                            y: "-10vh",
                            x: window.innerWidth - (Math.random() * (window.innerWidth * 0.2)),
                            opacity: [0, 0.8, 0],
                            rotate: -360
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            delay: -1 * Math.random() * 35,
                            ease: "linear"
                        }}
                        className="absolute w-8 h-8 text-emerald-600/40 drop-shadow-sm"
                        style={{
                            left: `${80 + Math.random() * 20}%`,
                            scale: Math.random() * 0.6 + 0.9
                        }}
                    >
                        <Leaf className="w-full h-full" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Panel: Inputs & Results */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        {/* Input Card */}
                        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-xl">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 drop-shadow-sm">
                                <Navigation className="w-5 h-5 text-emerald-600" /> Plan Your Trip
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Start Location</label>
                                    <input
                                        type="text"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-white/80 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
                                    <input
                                        type="text"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-white/80 border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                    />
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 border border-white/20 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}
                                >
                                    {loading ? 'Calculating...' : 'Find Greenest Route'}
                                </button>
                            </div>
                        </div>

                        {/* Green Impact Banner */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-md p-4 rounded-xl text-white shadow-xl relative overflow-hidden border border-emerald-400/30">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold flex items-center gap-2 text-lg drop-shadow-sm">
                                    <Leaf className="w-5 h-5 text-emerald-100" /> Green Impact
                                </h3>
                                <div className="mt-2 space-y-2 text-emerald-50 font-medium text-sm">
                                    {bestOption ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="space-y-1 bg-emerald-800/20 p-2 rounded-lg border border-emerald-400/20">
                                                <p className="flex justify-between"><span>Car:</span> <span className="font-bold text-white">{comparisons.find(c => c.mode === 'car')?.co2}</span></p>
                                                <p className="flex justify-between"><span>EV:</span> <span className="font-bold text-white">{comparisons.find(c => c.mode === 'ev')?.co2}</span></p>
                                                <p className="flex justify-between"><span>Metro:</span> <span className="font-bold text-white">{comparisons.find(c => c.mode === 'metro')?.co2}</span></p>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-white/30 text-center">
                                                <p className="text-sm leading-tight text-emerald-50 mb-1">
                                                    The best option to travel to save environment is
                                                </p>
                                                <p className="font-extrabold text-white text-xl drop-shadow-md underline decoration-emerald-300 decoration-4 underline-offset-4">
                                                    {bestOption.label}
                                                </p>
                                                <p className="text-xs mt-2 text-emerald-200">
                                                    Saves <span className="font-bold text-white">{bestOption.saved}</span> CO₂
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        "Calculate your route to see potential CO₂ savings!"
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-200/50 bg-white/40">
                                <h3 className="font-bold text-slate-800 drop-shadow-sm">Route Comparison</h3>
                            </div>
                            <div className="divide-y divide-slate-200/50">
                                {comparisons.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/60 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${item.bg} ${item.color.replace('text-', 'text-slate-').replace('400', '600')} shadow-sm transition-transform group-hover:scale-110 ring-1 ring-inset ring-black/5`}>
                                                <item.icon className={`w-5 h-5 ${item.color.replace('400', '600')}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.label}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                                                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {item.cost}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${item.color.replace('400', '600')}`}>{item.co2}</p>
                                            <p className="text-xs text-slate-400">CO₂</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Map & AI Insights */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 shadow-xl overflow-hidden relative h-[500px] md:h-[calc(100vh-300px)] z-0 ring-1 ring-black/5">
                            <MapContainer
                                center={[28.6139, 77.2090]}
                                zoom={5}
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <RecenterMap points={routePoints} />
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                <Marker position={routePoints[0]}>
                                    <Popup>Start: {start}</Popup>
                                </Marker>
                                <Marker position={routePoints[1]}>
                                    <Popup>End: {end}</Popup>
                                </Marker>
                                <Polyline positions={routePoints} color="#10b981" weight={5} opacity={0.8} />
                            </MapContainer>

                            {/* Live Navigation Overlay */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg z-[1000] border border-white/40 max-w-xs ring-1 ring-black/5">
                                <div className="flex items-start gap-3">
                                    <div className="bg-emerald-500 text-white p-2 rounded-full shadow-md animate-pulse">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Next: Turn Right</p>
                                        <p className="text-xs text-slate-500">in 200m on Green Avenue</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Suggestions Box (Separate Block) */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-emerald-600" /> AI Travel Insights
                                </h3>
                                <button
                                    onClick={() => fetchSuggestions()}
                                    disabled={aiLoading || !bestOption}
                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                >
                                    {aiLoading ? "Analyzing..." : "Refresh Insights"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${suggestion.type === 'Tip' ? 'bg-blue-100 text-blue-700' :
                                                        suggestion.type === 'Fact' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {suggestion.type}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">{suggestion.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{suggestion.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-slate-500 text-sm">
                                            {bestOption ? "AI is ready! Click Refresh to get personalized travel tips." : "Calculate a route above to unlock AI insights."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilityPage;
