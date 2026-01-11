import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 50000, // Default wallet balance: ₹50,000
        min: 0
    },
    transactions: [transactionSchema]
}, {
    timestamps: true
});

// Method to deduct amount
walletSchema.methods.deductAmount = async function (amount, description, bookingId) {
    if (this.balance < amount) {
        throw new Error('Insufficient wallet balance');
    }

    this.balance -= amount;
    this.transactions.push({
        type: 'debit',
        amount: amount,
        description: description,
        booking_id: bookingId
    });

    await this.save();
    return this;
};

// Method to add amount (for refunds)
walletSchema.methods.addAmount = async function (amount, description) {
    this.balance += amount;
    this.transactions.push({
        type: 'credit',
        amount: amount,
        description: description
    });

    await this.save();
    return this;
};

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
