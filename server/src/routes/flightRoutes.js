import express from 'express';
import {
    getFlights,
    getFlight,
    recordAttempt,
    getCities
} from '../controllers/flightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/cities', getCities);
router.get('/', getFlights);
router.get('/:id', getFlight);

// Protected routes (for surge pricing)
router.post('/:id/attempt', protect, recordAttempt);

// Optional auth middleware for pricing (doesn't require auth, but uses it if present)
router.use((req, res, next) => {
    // Try to extract user from token if present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        import('../middleware/auth.js').then(({ protect }) => {
            protect(req, res, () => {
                next();
            });
        }).catch(() => next());
    } else {
        next();
    }
});

export default router;
