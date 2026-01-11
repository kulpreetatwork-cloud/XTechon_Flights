import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Filter, X } from 'lucide-react';
import flightService from '../services/flightService';

const SearchForm = ({ onSearch, initialValues = {} }) => {
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        departure_city: initialValues.departure_city || '',
        arrival_city: initialValues.arrival_city || '',
        sort_by: initialValues.sort_by || 'price',
        sort_order: initialValues.sort_order || 'asc',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            const response = await flightService.getCities();
            if (response.success) {
                setCities(response.data);
            }
        } catch (error) {
            console.error('Failed to load cities:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        onSearch(formData);
        setTimeout(() => setLoading(false), 500);
    };

    const handleClear = () => {
        setFormData({
            departure_city: '',
            arrival_city: '',
            sort_by: 'price',
            sort_order: 'asc',
        });
        onSearch({});
    };

    const handleSwapCities = () => {
        setFormData(prev => ({
            ...prev,
            departure_city: prev.arrival_city,
            arrival_city: prev.departure_city,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="glass-dark rounded-2xl p-6 space-y-4">
                {/* Main Search Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* From City */}
                    <div className="flex-1 relative">
                        <label className="input-label flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-400" />
                            From
                        </label>
                        <select
                            value={formData.departure_city}
                            onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                            className="input appearance-none cursor-pointer"
                        >
                            <option value="">All Departure Cities</option>
                            {cities.map((city) => (
                                <option key={`from-${city}`} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Swap Button */}
                    <button
                        type="button"
                        onClick={handleSwapCities}
                        className="hidden lg:flex items-center justify-center w-12 h-12 mt-7 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-600 transition-all hover:scale-105"
                    >
                        <ArrowRight className="w-5 h-5 text-primary-400 rotate-0 lg:rotate-0" />
                    </button>

                    {/* To City */}
                    <div className="flex-1 relative">
                        <label className="input-label flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent-400" />
                            To
                        </label>
                        <select
                            value={formData.arrival_city}
                            onChange={(e) => setFormData({ ...formData, arrival_city: e.target.value })}
                            className="input appearance-none cursor-pointer"
                        >
                            <option value="">All Arrival Cities</option>
                            {cities.map((city) => (
                                <option key={`to-${city}`} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex gap-2 lg:mt-7">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary px-4 ${showFilters ? 'border-primary-500 text-primary-400' : ''}`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 lg:flex-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Search</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                {showFilters && (
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-dark-700 animate-slide-down">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-dark-400">Sort by:</span>
                            <select
                                value={formData.sort_by}
                                onChange={(e) => setFormData({ ...formData, sort_by: e.target.value })}
                                className="input py-2 px-3 w-auto"
                            >
                                <option value="price">Price</option>
                                <option value="airline">Airline</option>
                                <option value="departure_time">Departure Time</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-dark-400">Order:</span>
                            <select
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                className="input py-2 px-3 w-auto"
                            >
                                <option value="asc">Low to High</option>
                                <option value="desc">High to Low</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex items-center gap-1 text-sm text-dark-400 hover:text-white transition-colors ml-auto"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
};

export default SearchForm;
