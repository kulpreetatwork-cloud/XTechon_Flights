import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    CheckCircle,
    Plane,
    Download,
    ArrowRight,
    Sparkles,
    Calendar,
    Wallet
} from 'lucide-react';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Confetti particle component
const Confetti = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const colors = ['#6366f1', '#22c55e', '#f97316', '#eab308', '#ec4899', '#8b5cf6'];
        const newParticles = [];

        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 3,
                duration: 3 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 8,
            });
        }
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${particle.x}%`,
                        top: '-20px',
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                >
                    <div
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { walletBalance } = useAuth();
    const [downloading, setDownloading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const booking = location.state?.booking;

    useEffect(() => {
        if (!booking) {
            navigate('/flights');
            return;
        }

        // Hide confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [booking, navigate]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await bookingService.downloadTicket(booking._id);
            toast.success('Ticket downloaded!');
        } catch (error) {
            toast.error('Failed to download ticket');
        } finally {
            setDownloading(false);
        }
    };

    if (!booking) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            {showConfetti && <Confetti />}

            {/* Background Effects */}
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-lg">
                {/* Success Card */}
                <div className="glass-dark rounded-3xl p-8 text-center animate-in">
                    {/* Success Icon */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-secondary-500/20 rounded-full animate-ping" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-glow">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Booking Confirmed! 🎉
                    </h1>
                    <p className="text-dark-400 mb-6">
                        Your flight has been successfully booked
                    </p>

                    {/* PNR Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500/10 border border-primary-500/30 rounded-xl mb-8">
                        <span className="text-dark-400">PNR:</span>
                        <span className="text-2xl font-mono font-bold text-primary-400">{booking.pnr}</span>
                    </div>

                    {/* Flight Details Card */}
                    <div className="p-4 bg-dark-800/50 rounded-xl mb-6 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                <Plane className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">{booking.flight_details.airline}</p>
                                <p className="text-sm text-dark-400">{booking.flight_details.flight_id}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold text-white">{booking.flight_details.departure_city}</p>
                                <p className="text-sm text-dark-400">{booking.flight_details.departure_time}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-primary-400" />
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">{booking.flight_details.arrival_city}</p>
                                <p className="text-sm text-dark-400">{booking.flight_details.arrival_time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="flex items-center justify-between p-4 bg-secondary-500/10 border border-secondary-500/30 rounded-xl mb-6">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-secondary-400" />
                            <span className="text-dark-300">Amount Paid</span>
                        </div>
                        <span className="text-xl font-bold text-secondary-400">
                            ₹{booking.final_price.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {/* Booking Date */}
                    <div className="flex items-center justify-center gap-2 text-dark-400 mb-8">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                            {new Date(booking.booking_date).toLocaleString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="btn-primary flex-1"
                        >
                            {downloading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Ticket
                                </>
                            )}
                        </button>
                        <Link to="/bookings" className="btn-secondary flex-1">
                            View All Bookings
                        </Link>
                    </div>

                    {/* Sparkle decoration */}
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                </div>

                {/* Wallet Balance Reminder */}
                <div className="mt-6 p-4 glass rounded-xl text-center">
                    <p className="text-sm text-dark-400">
                        Remaining wallet balance:
                        <span className="text-secondary-400 font-semibold ml-1">
                            ₹{walletBalance.toLocaleString('en-IN')}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
