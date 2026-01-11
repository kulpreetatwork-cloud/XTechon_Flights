import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🛫 XTechon Flight Booking API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            flights: '/api/flights',
            bookings: '/api/bookings',
            wallet: '/api/wallet'
        }
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛫 XTechon Flight Booking API                          ║
║                                                           ║
║   Server running in ${process.env.NODE_ENV || 'development'} mode               ║
║   Port: ${PORT}                                            ║
║                                                           ║
║   Endpoints:                                              ║
║   • Auth:     http://localhost:${PORT}/api/auth             ║
║   • Flights:  http://localhost:${PORT}/api/flights          ║
║   • Bookings: http://localhost:${PORT}/api/bookings         ║
║   • Wallet:   http://localhost:${PORT}/api/wallet           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
