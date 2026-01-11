import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Wallet from '../models/Wallet.js';
import { calculateDynamicPrice, recordBookingAttempt } from '../utils/pricingEngine.js';
import { generateTicketPDF } from '../utils/pdfGenerator.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
    try {
        const { flight_id, passenger_name, passenger_email, passenger_phone } = req.body;

        // Validate input
        if (!flight_id || !passenger_name || !passenger_email) {
            res.status(400);
            throw new Error('Please provide flight ID, passenger name, and email');
        }

        // Get flight
        const flight = await Flight.findById(flight_id);
        if (!flight) {
            res.status(404);
            throw new Error('Flight not found');
        }

        // Record booking attempt for surge pricing
        await recordBookingAttempt(req.user._id, flight._id);

        // Calculate dynamic price
        const pricingInfo = await calculateDynamicPrice(
            req.user._id,
            flight._id,
            flight.base_price
        );

        const finalPrice = pricingInfo.finalPrice;

        // Get wallet
        const wallet = await Wallet.findOne({ user: req.user._id });
        if (!wallet) {
            res.status(404);
            throw new Error('Wallet not found. Please contact support.');
        }

        // Check wallet balance
        if (wallet.balance < finalPrice) {
            res.status(400);
            throw new Error(
                `Insufficient wallet balance. Required: ₹${finalPrice.toLocaleString('en-IN')}, ` +
                `Available: ₹${wallet.balance.toLocaleString('en-IN')}. ` +
                `Please add ₹${(finalPrice - wallet.balance).toLocaleString('en-IN')} to proceed.`
            );
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            flight: flight._id,
            passenger_name,
            passenger_email,
            passenger_phone,
            flight_details: {
                flight_id: flight.flight_id,
                airline: flight.airline,
                departure_city: flight.departure_city,
                arrival_city: flight.arrival_city,
                departure_time: flight.departure_time,
                arrival_time: flight.arrival_time,
                duration: flight.duration
            },
            base_price: flight.base_price,
            surge_applied: pricingInfo.surgeActive,
            surge_percentage: pricingInfo.surgePercentage,
            final_price: finalPrice
        });

        // Deduct from wallet
        await wallet.deductAmount(
            finalPrice,
            `Flight booking - ${flight.flight_id} (${flight.departure_city} → ${flight.arrival_city})`,
            booking._id
        );

        // Decrease available seats
        await Flight.findByIdAndUpdate(flight._id, {
            $inc: { available_seats: -1 }
        });

        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully!',
            data: {
                booking: {
                    _id: booking._id,
                    pnr: booking.pnr,
                    passenger_name: booking.passenger_name,
                    passenger_email: booking.passenger_email,
                    flight_details: booking.flight_details,
                    base_price: booking.base_price,
                    surge_applied: booking.surge_applied,
                    surge_percentage: booking.surge_percentage,
                    final_price: booking.final_price,
                    booking_date: booking.booking_date,
                    status: booking.status
                },
                wallet: {
                    newBalance: wallet.balance
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('flight', 'flight_id airline aircraft')
            .sort({ booking_date: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('flight');

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Download ticket PDF
// @route   GET /api/bookings/:id/ticket
// @access  Private
export const downloadTicket = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        // Generate PDF
        const pdfBuffer = await generateTicketPDF(booking);

        // Set headers for PDF download
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=ticket-${booking.pnr}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

// @desc    Get booking by PNR
// @route   GET /api/bookings/pnr/:pnr
// @access  Private
export const getBookingByPNR = async (req, res, next) => {
    try {
        const booking = await Booking.findOne({
            pnr: req.params.pnr.toUpperCase(),
            user: req.user._id
        });

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found with this PNR');
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};
