import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plane,
    Clock,
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    Timer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FlightCard = ({ flight, onBook }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [timeRemaining, setTimeRemaining] = useState(null);

    const pricing = flight.pricing || {
        basePrice: flight.base_price,
        finalPrice: flight.base_price,
        surgeActive: false,
    };

    useEffect(() => {
        if (pricing.surgeActive && pricing.timeRemaining) {
            setTimeRemaining(pricing.timeRemaining);

            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1000) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [pricing.surgeActive, pricing.timeRemaining]);

    const formatTime = (ms) => {
        if (!ms) return '';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleBookClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/flights' } });
            return;
        }
        onBook(flight);
    };

    return (
        <div className="card-hover group">
            {/* Surge Pricing Banner */}
            {pricing.surgeActive && (
                <div className="flex items-center justify-between gap-2 mb-4 p-3 bg-accent-500/10 border border-accent-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent-400" />
                        <span className="text-sm text-accent-300 font-medium">
                            Surge pricing active (+{pricing.surgePercentage}%)
                        </span>
                    </div>
                    {timeRemaining > 0 && (
                        <div className="flex items-center gap-1 text-accent-400">
                            <Timer className="w-4 h-4" />
                            <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Airline Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center">
                        <Plane className="w-7 h-7 text-primary-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{flight.airline}</p>
                        <p className="text-sm text-dark-400">{flight.flight_id}</p>
                    </div>
                </div>

                {/* Route Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        {/* Departure */}
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{flight.departure_time}</p>
                            <p className="text-sm text-dark-400">{flight.departure_city}</p>
                        </div>

                        {/* Duration Arrow */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-dark-500">
                                <div className="h-px flex-1 bg-dark-700" />
                                <Plane className="w-4 h-4 rotate-90 text-primary-400" />
                                <div className="h-px flex-1 bg-dark-700" />
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-dark-400">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{flight.duration}</span>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{flight.arrival_time}</p>
                            <p className="text-sm text-dark-400">{flight.arrival_city}</p>
                        </div>
                    </div>
                </div>

                {/* Price & Book */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                    <div className="text-right">
                        {pricing.surgeActive && (
                            <p className="text-sm text-dark-500 line-through">
                                ₹{pricing.basePrice.toLocaleString('en-IN')}
                            </p>
                        )}
                        <p className={`text-2xl font-bold ${pricing.surgeActive ? 'text-accent-400' : 'text-white'}`}>
                            ₹{pricing.finalPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-dark-400">per person</p>
                    </div>
                    <button
                        onClick={handleBookClick}
                        className="btn-primary whitespace-nowrap group-hover:shadow-glow"
                    >
                        Book Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-dark-700 flex flex-wrap items-center gap-4 text-sm text-dark-400">
                <span className="badge-primary">{flight.aircraft || 'Boeing 737'}</span>
                <span>{flight.available_seats} seats available</span>
                {pricing.attemptsCount > 0 && (
                    <span className="flex items-center gap-1 text-accent-400">
                        <AlertTriangle className="w-3 h-3" />
                        {pricing.attemptsCount} booking attempt(s)
                    </span>
                )}
            </div>
        </div>
    );
};

export default FlightCard;
