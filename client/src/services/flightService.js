import api from './api';

export const flightService = {
    // Get all flights with optional filters
    getFlights: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.departure_city) queryParams.append('departure_city', params.departure_city);
        if (params.arrival_city) queryParams.append('arrival_city', params.arrival_city);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        if (params.limit) queryParams.append('limit', params.limit);

        const response = await api.get(`/flights?${queryParams.toString()}`);
        return response.data;
    },

    // Get single flight by ID
    getFlight: async (id) => {
        const response = await api.get(`/flights/${id}`);
        return response.data;
    },

    // Record booking attempt (for surge pricing)
    recordAttempt: async (flightId) => {
        const response = await api.post(`/flights/${flightId}/attempt`);
        return response.data;
    },

    // Get unique cities for search
    getCities: async () => {
        const response = await api.get('/flights/cities');
        return response.data;
    },
};

export default flightService;
