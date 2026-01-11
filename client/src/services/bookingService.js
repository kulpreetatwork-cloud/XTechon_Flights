import api from './api';

export const bookingService = {
    // Create new booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get all user bookings
    getBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    // Get single booking
    getBooking: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Get booking by PNR
    getBookingByPNR: async (pnr) => {
        const response = await api.get(`/bookings/pnr/${pnr}`);
        return response.data;
    },

    // Download ticket PDF
    downloadTicket: async (bookingId) => {
        const response = await api.get(`/bookings/${bookingId}/ticket`, {
            responseType: 'blob',
        });

        // Create blob URL and trigger download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${bookingId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
    },
};

export default bookingService;
