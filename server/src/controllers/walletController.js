import Wallet from '../models/Wallet.js';

// @desc    Get wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
export const getWallet = async (req, res, next) => {
    try {
        let wallet = await Wallet.findOne({ user: req.user._id });

        // Create wallet if doesn't exist
        if (!wallet) {
            wallet = await Wallet.create({
                user: req.user._id,
                balance: 50000,
                transactions: [{
                    type: 'credit',
                    amount: 50000,
                    description: 'Initial wallet balance'
                }]
            });
        }

        res.json({
            success: true,
            data: {
                balance: wallet.balance,
                transactions: wallet.transactions.sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                ).slice(0, 20) // Last 20 transactions
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get wallet balance only
// @route   GET /api/wallet/balance
// @access  Private
export const getBalance = async (req, res, next) => {
    try {
        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            wallet = await Wallet.create({
                user: req.user._id,
                balance: 50000,
                transactions: [{
                    type: 'credit',
                    amount: 50000,
                    description: 'Initial wallet balance'
                }]
            });
        }

        res.json({
            success: true,
            data: {
                balance: wallet.balance
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if wallet has sufficient balance
// @route   POST /api/wallet/check
// @access  Private
export const checkBalance = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error('Please provide a valid amount');
        }

        const wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            res.status(404);
            throw new Error('Wallet not found');
        }

        const hasSufficientBalance = wallet.balance >= amount;

        res.json({
            success: true,
            data: {
                hasSufficientBalance,
                currentBalance: wallet.balance,
                requiredAmount: amount,
                shortfall: hasSufficientBalance ? 0 : amount - wallet.balance
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add funds to wallet (for testing)
// @route   POST /api/wallet/add
// @access  Private
export const addFunds = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error('Please provide a valid amount');
        }

        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            wallet = await Wallet.create({
                user: req.user._id,
                balance: 50000
            });
        }

        await wallet.addAmount(amount, 'Wallet top-up');

        res.json({
            success: true,
            message: `₹${amount} added to wallet successfully`,
            data: {
                newBalance: wallet.balance
            }
        });
    } catch (error) {
        next(error);
    }
};
