import Flight from '../models/Flight.js';
import PricingLog from '../models/PricingLog.js';
import { calculateDynamicPrice, recordBookingAttempt } from '../utils/pricingEngine.js';

// @desc    Get all flights with optional filters
// @route   GET /api/flights
// @access  Public (but pricing requires auth for surge)
export const getFlights = async (req, res, next) => {
    try {
        const {
            departure_city,
            arrival_city,
            sort_by,
            sort_order = 'asc',
            limit = 10
        } = req.query;

        // Build query
        const query = {};

        if (departure_city) {
            query.departure_city = new RegExp(departure_city, 'i');
        }

        if (arrival_city) {
            query.arrival_city = new RegExp(arrival_city, 'i');
        }

        // Build sort
        let sort = {};
        if (sort_by === 'price') {
            sort.base_price = sort_order === 'desc' ? -1 : 1;
        } else if (sort_by === 'airline') {
            sort.airline = sort_order === 'desc' ? -1 : 1;
        } else if (sort_by === 'departure_time') {
            sort.departure_time = sort_order === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const flights = await Flight.find(query)
            .sort(sort)
            .limit(parseInt(limit));

        // If user is authenticated, calculate dynamic pricing for each flight
        let flightsWithPricing = flights;

        if (req.user) {
            flightsWithPricing = await Promise.all(
                flights.map(async (flight) => {
                    const pricingInfo = await calculateDynamicPrice(
                        req.user._id,
                        flight._id,
                        flight.base_price
                    );

                    return {
                        ...flight.toObject(),
                        pricing: pricingInfo
                    };
                })
            );
        } else {
            flightsWithPricing = flights.map(flight => ({
                ...flight.toObject(),
                pricing: {
                    basePrice: flight.base_price,
                    finalPrice: flight.base_price,
                    surgeActive: false,
                    surgePercentage: 0
                }
            }));
        }

        res.json({
            success: true,
            count: flightsWithPricing.length,
            data: flightsWithPricing
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single flight by ID
// @route   GET /api/flights/:id
// @access  Public
export const getFlight = async (req, res, next) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            res.status(404);
            throw new Error('Flight not found');
        }

        let pricingInfo = {
            basePrice: flight.base_price,
            finalPrice: flight.base_price,
            surgeActive: false,
            surgePercentage: 0
        };

        if (req.user) {
            pricingInfo = await calculateDynamicPrice(
                req.user._id,
                flight._id,
                flight.base_price
            );
        }

        res.json({
            success: true,
            data: {
                ...flight.toObject(),
                pricing: pricingInfo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Record a booking attempt (for surge pricing)
// @route   POST /api/flights/:id/attempt
// @access  Private
export const recordAttempt = async (req, res, next) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            res.status(404);
            throw new Error('Flight not found');
        }

        // Record the booking attempt
        await recordBookingAttempt(req.user._id, flight._id);

        // Get updated pricing
        const pricingInfo = await calculateDynamicPrice(
            req.user._id,
            flight._id,
            flight.base_price
        );

        res.json({
            success: true,
            data: {
                flight_id: flight._id,
                pricing: pricingInfo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unique cities for search dropdowns
// @route   GET /api/flights/cities
// @access  Public
export const getCities = async (req, res, next) => {
    try {
        const departureCities = await Flight.distinct('departure_city');
        const arrivalCities = await Flight.distinct('arrival_city');

        const allCities = [...new Set([...departureCities, ...arrivalCities])].sort();

        res.json({
            success: true,
            data: allCities
        });
    } catch (error) {
        next(error);
    }
};
