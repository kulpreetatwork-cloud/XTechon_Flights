import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const bookingSchema = new mongoose.Schema({
    pnr: {
        type: String,
        unique: true,
        default: () => uuidv4().substring(0, 8).toUpperCase()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    passenger_name: {
        type: String,
        required: [true, 'Passenger name is required']
    },
    passenger_email: {
        type: String,
        required: [true, 'Passenger email is required']
    },
    passenger_phone: {
        type: String
    },
    flight_details: {
        flight_id: String,
        airline: String,
        departure_city: String,
        arrival_city: String,
        departure_time: String,
        arrival_time: String,
        duration: String
    },
    base_price: {
        type: Number,
        required: true
    },
    surge_applied: {
        type: Boolean,
        default: false
    },
    surge_percentage: {
        type: Number,
        default: 0
    },
    final_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    },
    booking_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
bookingSchema.index({ user: 1, booking_date: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
