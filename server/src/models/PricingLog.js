import mongoose from 'mongoose';

const pricingLogSchema = new mongoose.Schema({
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
    attempts: [{
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    surge_active: {
        type: Boolean,
        default: false
    },
    surge_started_at: {
        type: Date
    },
    last_attempt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for user-flight combination
pricingLogSchema.index({ user: 1, flight: 1 }, { unique: true });

// Method to record a booking attempt
pricingLogSchema.methods.recordAttempt = async function () {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Filter attempts within last 5 minutes
    this.attempts = this.attempts.filter(
        attempt => new Date(attempt.timestamp) > fiveMinutesAgo
    );

    // Add new attempt
    this.attempts.push({ timestamp: now });
    this.last_attempt = now;

    // Check if surge should be activated (3 or more attempts in 5 minutes)
    if (this.attempts.length >= 3 && !this.surge_active) {
        this.surge_active = true;
        this.surge_started_at = now;
    }

    await this.save();
    return this;
};

// Method to check if surge should be reset (after 10 minutes)
pricingLogSchema.methods.checkSurgeReset = async function () {
    if (this.surge_active && this.surge_started_at) {
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

        if (new Date(this.surge_started_at) < tenMinutesAgo) {
            this.surge_active = false;
            this.surge_started_at = null;
            this.attempts = [];
            await this.save();
        }
    }
    return this;
};

// Static method to get current price multiplier
pricingLogSchema.statics.getPriceMultiplier = async function (userId, flightId) {
    let log = await this.findOne({ user: userId, flight: flightId });

    if (!log) {
        return { multiplier: 1, surgeActive: false, timeRemaining: null };
    }

    await log.checkSurgeReset();

    if (log.surge_active) {
        const now = new Date();
        const surgeEnd = new Date(log.surge_started_at.getTime() + 10 * 60 * 1000);
        const timeRemaining = Math.max(0, surgeEnd - now);

        return {
            multiplier: 1.10, // 10% increase
            surgeActive: true,
            timeRemaining: timeRemaining,
            attemptsCount: log.attempts.length
        };
    }

    return {
        multiplier: 1,
        surgeActive: false,
        timeRemaining: null,
        attemptsCount: log.attempts.length
    };
};

const PricingLog = mongoose.model('PricingLog', pricingLogSchema);

export default PricingLog;
