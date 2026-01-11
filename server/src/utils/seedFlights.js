import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import Flight from '../models/Flight.js';

const airlines = [
    'IndiGo',
    'Air India',
    'SpiceJet',
    'Vistara',
    'Go First',
    'AirAsia India',
    'Akasa Air'
];

const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Ahmedabad',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Goa',
    'Kochi'
];

const aircraftTypes = [
    'Airbus A320',
    'Boeing 737',
    'Airbus A321neo',
    'Boeing 737 MAX',
    'ATR 72'
];

const generateFlightId = (airline, index) => {
    const prefix = airline.substring(0, 2).toUpperCase();
    const number = String(100 + index).padStart(3, '0');
    return `${prefix}${number}`;
};

const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 4) * 15;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const calculateArrivalTime = (departureTime, durationMinutes) => {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinutes = totalMinutes % 60;
    return `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`;
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const generateFlights = () => {
    const flights = [];
    let flightIndex = 0;

    // Generate 18 flights (15-20 as per requirement)
    for (let i = 0; i < 18; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureCity = cities[Math.floor(Math.random() * cities.length)];
        let arrivalCity = cities[Math.floor(Math.random() * cities.length)];

        // Ensure departure and arrival cities are different
        while (arrivalCity === departureCity) {
            arrivalCity = cities[Math.floor(Math.random() * cities.length)];
        }

        const departureTime = getRandomTime();
        const durationMinutes = 60 + Math.floor(Math.random() * 180); // 1-4 hours
        const arrivalTime = calculateArrivalTime(departureTime, durationMinutes);

        // Base price between ₹2000 - ₹3000
        const basePrice = 2000 + Math.floor(Math.random() * 1001);

        flights.push({
            flight_id: generateFlightId(airline, flightIndex++),
            airline,
            departure_city: departureCity,
            arrival_city: arrivalCity,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            duration: formatDuration(durationMinutes),
            base_price: basePrice,
            available_seats: 30 + Math.floor(Math.random() * 120),
            aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)]
        });
    }

    return flights;
};

const seedFlights = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing flights
        console.log('🗑️  Clearing existing flights...');
        await Flight.deleteMany({});

        // Generate and insert flights
        const flights = generateFlights();
        console.log(`📝 Inserting ${flights.length} flights...`);

        await Flight.insertMany(flights);

        console.log('✅ Successfully seeded flights:');
        console.log('─'.repeat(80));

        flights.forEach((flight, index) => {
            console.log(
                `${index + 1}. ${flight.flight_id} | ${flight.airline.padEnd(15)} | ` +
                `${flight.departure_city.padEnd(12)} → ${flight.arrival_city.padEnd(12)} | ` +
                `₹${flight.base_price}`
            );
        });

        console.log('─'.repeat(80));
        console.log(`\n🎉 Total flights seeded: ${flights.length}`);

        await mongoose.connection.close();
        console.log('📤 Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding flights:', error);
        process.exit(1);
    }
};

seedFlights();
