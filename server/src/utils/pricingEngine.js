import PricingLog from '../models/PricingLog.js';

/**
 * Dynamic Pricing Engine
 * 
 * Rules:
 * - If a user tries to book the same flight 3 times within 5 minutes, increase price by 10%
 * - After 10 minutes of surge activation, the price resets to original base price
 */

export const calculateDynamicPrice = async (userId, flightId, basePrice) => {
    try {
        const pricingInfo = await PricingLog.getPriceMultiplier(userId, flightId);

        const finalPrice = Math.round(basePrice * pricingInfo.multiplier);

        return {
            basePrice,
            finalPrice,
            surgeActive: pricingInfo.surgeActive,
            surgePercentage: pricingInfo.surgeActive ? 10 : 0,
            timeRemaining: pricingInfo.timeRemaining,
            attemptsCount: pricingInfo.attemptsCount || 0
        };
    } catch (error) {
        console.error('Pricing engine error:', error);
        return {
            basePrice,
            finalPrice: basePrice,
            surgeActive: false,
            surgePercentage: 0,
            timeRemaining: null,
            attemptsCount: 0
        };
    }
};

export const recordBookingAttempt = async (userId, flightId) => {
    try {
        let pricingLog = await PricingLog.findOne({ user: userId, flight: flightId });

        if (!pricingLog) {
            pricingLog = new PricingLog({
                user: userId,
                flight: flightId,
                attempts: []
            });
        }

        await pricingLog.recordAttempt();

        return pricingLog;
    } catch (error) {
        console.error('Record attempt error:', error);
        throw error;
    }
};

export const getSurgeInfo = async (userId, flightId) => {
    try {
        const pricingLog = await PricingLog.findOne({ user: userId, flight: flightId });

        if (!pricingLog) {
            return {
                surgeActive: false,
                attemptsInWindow: 0,
                timeRemaining: null
            };
        }

        await pricingLog.checkSurgeReset();

        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const attemptsInWindow = pricingLog.attempts.filter(
            a => new Date(a.timestamp) > fiveMinutesAgo
        ).length;

        let timeRemaining = null;
        if (pricingLog.surge_active && pricingLog.surge_started_at) {
            const surgeEnd = new Date(pricingLog.surge_started_at.getTime() + 10 * 60 * 1000);
            timeRemaining = Math.max(0, surgeEnd - now);
        }

        return {
            surgeActive: pricingLog.surge_active,
            attemptsInWindow,
            timeRemaining
        };
    } catch (error) {
        console.error('Get surge info error:', error);
        return {
            surgeActive: false,
            attemptsInWindow: 0,
            timeRemaining: null
        };
    }
};
