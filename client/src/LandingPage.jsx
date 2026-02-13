import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Globe, BarChart3, Leaf } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
    const [currentTagline, setCurrentTagline] = React.useState(0);
    const taglines = [
        "Smarter Cities. Cleaner Futures.",
        "Powering Tomorrow, Sustainably.",
        "Design Smart. Live Green.",
        "Intelligence for a Low-Carbon World.",
        "Where Innovation Meets Sustainability.",
        "Smarter Decisions. Smaller Footprints.",
        "Technology for a Climate-Positive Future."
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative min-h-screen bg-gray-50 overflow-hidden text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/back.jpg')" }}
        >
            {/* Animated Background Elements - Nature/Green Theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 40, 0], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/30 rounded-full blur-[120px]"
                />

                {/* Floating Leaves/Particles */}
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            y: 1200,
                            x: Math.random() * window.innerWidth,
                            opacity: 0
                        }}
                        animate={{
                            y: -200,
                            x: Math.random() * window.innerWidth,
                            opacity: [0, 0.8, 0],
                            rotate: 360
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                        className="absolute w-6 h-6 text-emerald-300/60 drop-shadow-lg"
                        style={{
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.5 + 0.8
                        }}
                    >
                        <Leaf className="w-full h-full" />
                    </motion.div>
                ))}
            </div>

            {/* Navbar */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-2 text-2xl font-bold text-white drop-shadow-md"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-300 rounded-lg flex items-center justify-center text-emerald-900 shadow-lg shadow-emerald-900/20">
                        <Leaf className="w-5 h-5" />
                    </div>
                    UrbanMind
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    onClick={onGetStarted}
                    className="px-6 py-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                >
                    Dashboard Login
                </motion.button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 text-sm font-semibold shadow-lg backdrop-blur-md"
                >
                    <Sparkles className="w-4 h-4 mr-2 text-emerald-300" />
                    Building a Sustainable Future
                </motion.div>

                <div className="min-h-[160px] flex items-center justify-center mb-8">
                    <motion.h1
                        key={currentTagline}
                        className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg leading-[1.2] max-w-5xl"
                    >
                        {taglines[currentTagline].split(" ").map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                className="inline-block mr-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-100 to-green-200"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-emerald-50/90 max-w-2xl mb-12 font-medium drop-shadow-md"
                >
                    Harnessing the power of AI to optimize urban energy consumption, reduce carbon footprints, and transition to renewable sources seamlessly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                    className="flex flex-col sm:flex-row gap-5"
                >
                    <button
                        onClick={onGetStarted}
                        className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:-translate-y-1 flex items-center justify-center border border-emerald-400/50"
                    >
                        Start Optimizing
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-full font-bold text-lg transition-all shadow-lg backdrop-blur-sm">
                        Watch Demo
                    </button>
                </motion.div>

                {/* Feature Cards with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full">
                    {[
                        { icon: Globe, title: "Eco Monitoring", desc: "Real-time tracking of city-wide energy usage and environmental impact.", color: "bg-blue-500" },
                        { icon: BarChart3, title: "AI Forecasting", desc: "Predictive algorithms to manage load balancing and prevent waste.", color: "bg-purple-500" },
                        { icon: Zap, title: "Green Shift", desc: "Automated suggestions to switch to solar/wind during peak availability.", color: "bg-yellow-500" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 + (index * 0.15), type: "spring", bounce: 0.3 }}
                            whileHover={{ y: -8, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            className="p-8 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md transition-all text-left"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.color}/20 flex items-center justify-center mb-6 text-white border border-white/10`}>
                                <feature.icon className="w-7 h-7 drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white dropping-shadow-md">{feature.title}</h3>
                            <p className="text-emerald-100/80 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
