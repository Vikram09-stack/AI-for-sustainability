import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Timer, Leaf, DollarSign, Bus, Car, Train, Bike } from 'lucide-react';
import Map from '../components/Map';

const transportModes = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'metro', label: 'Metro', icon: Train },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'monitor', label: 'Bike', icon: Bike },
];

const routes = [
    { mode: 'Metro', time: '25 min', cost: '$2.50', co2: '0.2 kg', icon: Train, recommended: true, savings: '85%' },
    { mode: 'EV Car', time: '35 min', cost: '$4.00', co2: '0.8 kg', icon: Car, recommended: false, savings: '40%' },
    { mode: 'Bus', time: '40 min', cost: '$1.50', co2: '0.4 kg', icon: Bus, recommended: false, savings: '70%' },
    { mode: 'Car (Petrol)', time: '35 min', cost: '$6.50', co2: '3.2 kg', icon: Car, recommended: false, savings: '0%' }, // Baseline
];

export default function Mobility() {
    const [start, setStart] = useState('');
    const [dest, setDest] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Route Input & Results */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-primary" /> Plan Your Trip
                        </h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Start Location"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-primary" />
                                <input
                                    type="text"
                                    placeholder="Destination"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={dest}
                                    onChange={(e) => setDest(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <select className="w-full pl-9 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none">
                                        <option>Leave Now</option>
                                        <option>Depart at...</option>
                                        <option>Arrive by...</option>
                                    </select>
                                </div>
                                <button className="bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                    Find Routes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm">Collective Impact</h4>
                            <p className="text-xs text-emerald-700 mt-1">If 100 people usually switch to Metro, we save <span className="font-bold">2.4 tons</span> of CO₂ weekly.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Map & Comparison */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="bg-white p-1 rounded-2xl shadow-soft border border-gray-100 h-[300px] relative z-0">
                        <Map center={[40.7128, -74.0060]} zoom={12} markers={[{ position: [40.7128, -74.0060], popup: 'NYC' }]} />

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold z-[400] border border-gray-100">
                            Route Preview
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Route Comparison</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Sorted by: Ecology</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Mode</th>
                                        <th className="px-6 py-3">Time</th>
                                        <th className="px-6 py-3">Cost</th>
                                        <th className="px-6 py-3">CO₂</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {routes.map((route, idx) => (
                                        <tr key={idx} className={`hover:bg-gray-50 transition-colors ${route.recommended ? 'bg-emerald-50/30' : ''}`}>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${route.recommended ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <route.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{route.mode}</div>
                                                    {route.recommended && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Best Choice</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">{route.time}</td>
                                            <td className="px-6 py-4 text-gray-600">{route.cost}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${route.recommended ? 'text-emerald-600' : 'text-gray-900'}`}>{route.co2}</span>
                                                    {route.savings !== '0%' && (
                                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex items-center">
                                                            <Leaf className="w-3 h-3 mr-0.5" /> -{route.savings}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-primary hover:text-primary-dark font-medium text-xs border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all">
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
