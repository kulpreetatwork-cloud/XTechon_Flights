import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Plane,
    Wallet,
    History,
    LogOut,
    User,
    Menu,
    X,
    Home
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, walletBalance, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/flights', label: 'Flights', icon: Plane },
        { path: '/bookings', label: 'My Bookings', icon: History, protected: true },
        { path: '/wallet', label: 'Wallet', icon: Wallet, protected: true },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white hidden sm:block">
                            XTechon<span className="text-primary-400">Flights</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            if (link.protected && !isAuthenticated) return null;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* Wallet Balance */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
                                    <Wallet className="w-4 h-4 text-secondary-400" />
                                    <span className="text-secondary-300 font-semibold">
                                        ₹{walletBalance.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* User Menu */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-dark-300">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-ghost text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-dark-300 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-dark border-t border-dark-700 animate-slide-down">
                    <div className="px-4 py-4 space-y-2">
                        {isAuthenticated && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-secondary-500/10 border border-secondary-500/30 rounded-xl mb-4">
                                <Wallet className="w-4 h-4 text-secondary-400" />
                                <span className="text-secondary-300 font-semibold">
                                    ₹{walletBalance.toLocaleString('en-IN')}
                                </span>
                                <span className="text-dark-400 text-sm ml-auto">{user?.name}</span>
                            </div>
                        )}

                        {navLinks.map((link) => {
                            if (link.protected && !isAuthenticated) return null;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(link.path)
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2 pt-4 border-t border-dark-700">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-secondary w-full"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-primary w-full"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
