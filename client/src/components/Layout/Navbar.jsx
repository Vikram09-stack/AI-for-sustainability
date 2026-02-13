import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Zap, Info, Leaf } from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/mobility', label: 'Mobility', icon: Car },
        { to: '/energy', label: 'Energy', icon: Zap },
        { to: '/carbon', label: 'Carbon', icon: Leaf },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-xl">
                    <Leaf className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    EcoCity
                </span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-full">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                ? 'bg-white text-primary shadow-sm shadow-gray-200'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`
                        }
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                <Info className="w-4 h-4" />
                About
            </button>
        </nav>
    );
};

export default Navbar;
