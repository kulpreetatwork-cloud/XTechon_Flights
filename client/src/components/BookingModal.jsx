import { useState } from 'react';
import {
    X,
    Plane,
    User,
    Mail,
    Phone,
    Wallet,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import flightService from '../services/flightService';
import toast from 'react-hot-toast';

const BookingModal = ({ flight, onClose, onSuccess }) => {
    const { user, walletBalance, updateWalletBalance } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        passenger_name: user?.name || '',
        passenger_email: user?.email || '',
        passenger_phone: '',
    });

    const pricing = flight.pricing || {
        basePrice: flight.base_price,
        finalPrice: flight.base_price,
        surgeActive: false,
    };

    const isBalanceSufficient = walletBalance >= pricing.finalPrice;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isBalanceSufficient) {
            toast.error('Insufficient wallet balance!');
            return;
        }

        setLoading(true);
        try {
            // Record booking attempt for surge pricing
            await flightService.recordAttempt(flight._id);

            // Create booking
            const response = await bookingService.createBooking({
                flight_id: flight._id,
                ...formData,
            });

            if (response.success) {
                updateWalletBalance(response.data.wallet.newBalance);
                toast.success('Booking confirmed! 🎉');
                onSuccess(response.data.booking);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg glass-dark rounded-2xl p-6 animate-slide-up my-8 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Complete Your Booking</h2>
                    <p className="text-dark-400">Fill in passenger details to confirm your flight</p>
                </div>

                {/* Flight Summary */}
                <div className="p-4 bg-dark-800/50 rounded-xl mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                            <Plane className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{flight.airline}</p>
                            <p className="text-sm text-dark-400">{flight.flight_id}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="text-white font-medium">{flight.departure_city}</p>
                            <p className="text-dark-400">{flight.departure_time}</p>
                        </div>
                        <div className="flex items-center gap-2 text-dark-500">
                            <div className="h-px w-8 bg-dark-600" />
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">{flight.duration}</span>
                            <div className="h-px w-8 bg-dark-600" />
                        </div>
                        <div className="text-right">
                            <p className="text-white font-medium">{flight.arrival_city}</p>
                            <p className="text-dark-400">{flight.arrival_time}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="input-label flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Passenger Name
                        </label>
                        <input
                            type="text"
                            value={formData.passenger_name}
                            onChange={(e) => setFormData({ ...formData, passenger_name: e.target.value })}
                            className="input"
                            placeholder="Enter full name"
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
                            value={formData.passenger_email}
                            onChange={(e) => setFormData({ ...formData, passenger_email: e.target.value })}
                            className="input"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label className="input-label flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            value={formData.passenger_phone}
                            onChange={(e) => setFormData({ ...formData, passenger_phone: e.target.value })}
                            className="input"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Payment Summary */}
                    <div className="p-4 bg-dark-800/50 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-dark-400">Base Price</span>
                            <span className="text-white">₹{pricing.basePrice.toLocaleString('en-IN')}</span>
                        </div>

                        {pricing.surgeActive && (
                            <div className="flex items-center justify-between text-accent-400">
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    Surge ({pricing.surgePercentage}%)
                                </span>
                                <span>+₹{(pricing.finalPrice - pricing.basePrice).toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        <div className="border-t border-dark-700 pt-3 flex items-center justify-between">
                            <span className="font-semibold text-white">Total Amount</span>
                            <span className="text-xl font-bold text-primary-400">
                                ₹{pricing.finalPrice.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="flex items-center gap-2 text-dark-400">
                                <Wallet className="w-4 h-4" />
                                Wallet Balance
                            </span>
                            <span className={`font-semibold ${isBalanceSufficient ? 'text-secondary-400' : 'text-red-400'}`}>
                                ₹{walletBalance.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    {/* Insufficient Balance Warning */}
                    {!isBalanceSufficient && (
                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-300 font-medium">Insufficient Balance</p>
                                <p className="text-sm text-red-400/80">
                                    You need ₹{(pricing.finalPrice - walletBalance).toLocaleString('en-IN')} more to complete this booking.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !isBalanceSufficient}
                        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isBalanceSufficient
                            ? 'btn-primary'
                            : 'bg-dark-700 text-dark-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Confirm & Pay ₹{pricing.finalPrice.toLocaleString('en-IN')}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
