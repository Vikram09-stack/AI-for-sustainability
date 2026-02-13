import { useState } from 'react';
import { Lightbulb, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { getOptimizationSuggestions } from '../services/api';

const OptimizationPanel = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const handleAnalysis = async () => {
        setLoading(true);
        try {
            // Context data for analysis - normally this would come from the current state/context
            const currentContext = {
                consumption: 750, // Mock current consumption
                hour: new Date().getHours(),
                loadType: "HVAC" // Default focus
            };

            const suggestions = await getOptimizationSuggestions(currentContext);
            setSuggestions(suggestions);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">AI Optimization</h2>
                    <p className="text-slate-500 mt-1">Real-time intelligent analysis for energy efficiency</p>
                </div>
                <button
                    onClick={handleAnalysis}
                    disabled={loading}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-200 ${loading
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-emerald-300 hover:scale-105 active:scale-95'
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Lightbulb className="w-5 h-5 mr-2" />
                            Run Analysis
                        </>
                    )}
                </button>
            </div>

            {lastUpdated && (
                <div className="text-sm text-slate-500 text-right">
                    Last analysis: {lastUpdated}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {suggestions.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.type === 'warning' ? 'bg-amber-400' :
                                item.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`} />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${item.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                            item.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.action}
                                    </span>
                                    <span className="text-slate-400 text-sm flex items-center">
                                        <ArrowRight className="w-3 h-3 mx-1" />
                                        {item.target}
                                    </span>
                                </div>
                                <p className="text-slate-700 text-lg font-medium leading-relaxed">
                                    {item.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Savings</p>
                                    <p className="text-2xl font-bold text-emerald-600">{item.potential_savings}</p>
                                </div>
                                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-500 transition-colors">
                                    <CheckCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {suggestions.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600">No suggestions yet</h3>
                        <p className="text-slate-500 mt-2">Run the AI analysis to get optimization insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizationPanel;
