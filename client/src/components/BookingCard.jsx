import {
    Plane,
    Calendar,
    Download,
    CheckCircle,
    Clock,
    TrendingUp
} from 'lucide-react';

const BookingCard = ({ booking, onDownload, downloading }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="card-hover">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary-500/10 border border-secondary-500/30 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Booking Confirmed</p>
                        <p className="text-sm text-dark-400">PNR: <span className="font-mono text-primary-400">{booking.pnr}</span></p>
                    </div>
                </div>
                <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {booking.status}
                </span>
            </div>

            {/* Flight Details */}
            <div className="p-4 bg-dark-800/50 rounded-xl mb-4">
                <div className="flex items-center gap-4 mb-3">
                    <Plane className="w-5 h-5 text-primary-400" />
                    <div>
                        <p className="font-medium text-white">
                            {booking.flight_details.airline} - {booking.flight_details.flight_id}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-white">{booking.flight_details.departure_time}</p>
                        <p className="text-sm text-dark-400">{booking.flight_details.departure_city}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center mx-4">
                        <div className="flex items-center gap-2 text-dark-500">
                            <div className="h-px flex-1 bg-dark-700 min-w-[30px]" />
                            <Plane className="w-4 h-4 text-primary-400" />
                            <div className="h-px flex-1 bg-dark-700 min-w-[30px]" />
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-dark-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{booking.flight_details.duration}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold text-white">{booking.flight_details.arrival_time}</p>
                        <p className="text-sm text-dark-400">{booking.flight_details.arrival_city}</p>
                    </div>
                </div>
            </div>

            {/* Passenger & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-dark-400 mb-1">Passenger</p>
                    <p className="font-medium text-white">{booking.passenger_name}</p>
                    <p className="text-sm text-dark-400">{booking.passenger_email}</p>
                </div>
                <div className="sm:text-right">
                    <p className="text-xs text-dark-400 mb-1">Amount Paid</p>
                    <p className="text-xl font-bold text-secondary-400">
                        ₹{booking.final_price.toLocaleString('en-IN')}
                    </p>
                    {booking.surge_applied && (
                        <p className="text-xs text-accent-400 flex items-center gap-1 sm:justify-end">
                            <TrendingUp className="w-3 h-3" />
                            Includes {booking.surge_percentage}% surge
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(booking.booking_date)}
                </div>
                <button
                    onClick={() => onDownload(booking._id)}
                    disabled={downloading === booking._id}
                    className="btn-primary text-sm py-2"
                >
                    {downloading === booking._id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download Ticket
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BookingCard;
