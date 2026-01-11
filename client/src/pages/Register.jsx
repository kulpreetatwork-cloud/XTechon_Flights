import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Plane, ArrowRight, Eye, EyeOff, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);
            if (response.success) {
                toast.success('Account created! Welcome aboard! 🎉');
                navigate('/flights');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center overflow-y-auto">
            {/* Background Effects */}
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-white">
                            XTechon<span className="text-primary-400">Flights</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="glass-dark rounded-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-dark-400">Join us and start booking flights</p>
                    </div>

                    {/* Wallet Bonus Banner */}
                    <div className="flex items-center gap-3 p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-xl mb-6">
                        <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-secondary-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-secondary-300">Welcome Bonus!</p>
                            <p className="text-xs text-dark-400">Get ₹50,000 wallet balance on signup</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="input-label flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="input-label flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input pr-12"
                                    placeholder="Create a password (min 6 chars)"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
