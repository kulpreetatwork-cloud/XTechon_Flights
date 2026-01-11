import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    flight_id: {
        type: String,
        required: true,
        unique: true
    },
    airline: {
        type: String,
        required: true
    },
    departure_city: {
        type: String,
        required: true
    },
    arrival_city: {
        type: String,
        required: true
    },
    departure_time: {
        type: String,
        required: true
    },
    arrival_time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true,
        min: 2000,
        max: 3000
    },
    available_seats: {
        type: Number,
        default: 60
    },
    aircraft: {
        type: String,
        default: 'Boeing 737'
    }
}, {
    timestamps: true
});

// Index for faster search queries
flightSchema.index({ departure_city: 1, arrival_city: 1 });

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
