import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Search, AlertCircle } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import flightService from '../services/flightService';
import toast from 'react-hot-toast';

const Flights = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [searchExecuted, setSearchExecuted] = useState(false);

    const initialFilters = {
        departure_city: searchParams.get('from') || '',
        arrival_city: searchParams.get('to') || '',
        sort_by: searchParams.get('sort') || 'price',
        sort_order: searchParams.get('order') || 'asc',
    };

    useEffect(() => {
        loadFlights(initialFilters);
    }, []);

    const loadFlights = async (params = {}) => {
        setLoading(true);
        setSearchExecuted(true);
        try {
            const response = await flightService.getFlights({
                ...params,
                limit: 10,
            });
            if (response.success) {
                setFlights(response.data);
            }
        } catch (error) {
            toast.error('Failed to load flights. Please try again.');
            console.error('Load flights error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (filters) => {
        // Update URL params
        const newParams = new URLSearchParams();
        if (filters.departure_city) newParams.set('from', filters.departure_city);
        if (filters.arrival_city) newParams.set('to', filters.arrival_city);
        if (filters.sort_by) newParams.set('sort', filters.sort_by);
        if (filters.sort_order) newParams.set('order', filters.sort_order);
        setSearchParams(newParams);

        loadFlights(filters);
    };

    const handleBook = (flight) => {
        setSelectedFlight(flight);
    };

    const handleBookingSuccess = (booking) => {
        setSelectedFlight(null);
        // Navigate to success page with confetti!
        navigate('/booking-success', { state: { booking } });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Find Your Perfect Flight
                    </h1>
                    <p className="text-dark-400">
                        Search from our database of available flights
                    </p>
                </div>

                {/* Search Form */}
                <div className="mb-8">
                    <SearchForm onSearch={handleSearch} initialValues={initialFilters} />
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {/* Results Header */}
                    {searchExecuted && !loading && (
                        <div className="flex items-center justify-between">
                            <p className="text-dark-400">
                                {flights.length > 0 ? (
                                    <>Found <span className="text-white font-semibold">{flights.length}</span> flights</>
                                ) : (
                                    'No flights found'
                                )}
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4 animate-pulse">
                                <Plane className="w-8 h-8 text-primary-400 animate-bounce" />
                            </div>
                            <p className="text-dark-400">Searching for flights...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && flights.length === 0 && searchExecuted && (
                        <div className="flex flex-col items-center justify-center py-20 glass-dark rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-dark-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Flights Found</h3>
                            <p className="text-dark-400 text-center max-w-md">
                                We couldn't find any flights matching your criteria. Try adjusting your search filters.
                            </p>
                        </div>
                    )}

                    {/* Flight Cards */}
                    {!loading && flights.map((flight, index) => (
                        <div
                            key={flight._id}
                            className="animate-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <FlightCard
                                flight={flight}
                                onBook={handleBook}
                            />
                        </div>
                    ))}
                </div>

                {/* Info Banner */}
                {!loading && flights.length > 0 && (
                    <div className="mt-8 p-4 glass rounded-xl flex items-start gap-3">
                        <Search className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-dark-300">
                                <span className="text-white font-medium">Pro Tip:</span> Booking the same flight multiple times within 5 minutes will trigger surge pricing (+10%).
                                Prices reset after 10 minutes of inactivity.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedFlight && (
                <BookingModal
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default Flights;
