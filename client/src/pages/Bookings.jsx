import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    History,
    Plane,
    Search,
    AlertCircle,
    Download
} from 'lucide-react';
import BookingCard from '../components/BookingCard';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [searchPNR, setSearchPNR] = useState('');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getBookings();
            if (response.success) {
                setBookings(response.data);
            }
        } catch (error) {
            toast.error('Failed to load bookings');
            console.error('Load bookings error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (bookingId) => {
        setDownloading(bookingId);
        try {
            await bookingService.downloadTicket(bookingId);
            toast.success('Ticket downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download ticket');
            console.error('Download error:', error);
        } finally {
            setDownloading(null);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        searchPNR === '' || booking.pnr.toLowerCase().includes(searchPNR.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <History className="w-8 h-8 text-primary-400" />
                            My Bookings
                        </h1>
                        <p className="text-dark-400 mt-1">
                            View and manage your flight bookings
                        </p>
                    </div>

                    {/* PNR Search */}
                    {bookings.length > 0 && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                            <input
                                type="text"
                                placeholder="Search by PNR..."
                                value={searchPNR}
                                onChange={(e) => setSearchPNR(e.target.value)}
                                className="input pl-10 py-2 w-full md:w-64"
                            />
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4 animate-pulse">
                            <Plane className="w-8 h-8 text-primary-400" />
                        </div>
                        <p className="text-dark-400">Loading your bookings...</p>
                    </div>
                )}

                {/* No Bookings */}
                {!loading && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 glass-dark rounded-2xl">
                        <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mb-6">
                            <Plane className="w-10 h-10 text-dark-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                        <p className="text-dark-400 text-center max-w-md mb-6">
                            You haven't made any flight bookings yet. Start by searching for flights!
                        </p>
                        <Link to="/flights" className="btn-primary">
                            <Search className="w-5 h-5" />
                            Search Flights
                        </Link>
                    </div>
                )}

                {/* No Search Results */}
                {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 glass-dark rounded-2xl">
                        <AlertCircle className="w-12 h-12 text-dark-500 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                        <p className="text-dark-400">
                            No bookings found with PNR "{searchPNR}"
                        </p>
                    </div>
                )}

                {/* Bookings List */}
                {!loading && filteredBookings.length > 0 && (
                    <div className="space-y-4">
                        {filteredBookings.map((booking, index) => (
                            <div
                                key={booking._id}
                                className="animate-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <BookingCard
                                    booking={booking}
                                    onDownload={handleDownload}
                                    downloading={downloading}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {!loading && bookings.length > 0 && (
                    <div className="mt-8 p-4 glass rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-dark-400">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">
                                Total bookings: <span className="text-white font-semibold">{bookings.length}</span>
                            </span>
                        </div>
                        <p className="text-sm text-dark-400">
                            Total spent: <span className="text-secondary-400 font-semibold">
                                ₹{bookings.reduce((acc, b) => acc + b.final_price, 0).toLocaleString('en-IN')}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
