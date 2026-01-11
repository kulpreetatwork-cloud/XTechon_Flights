import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists with this email');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Create wallet for user with default balance of ₹50,000
        await Wallet.create({
            user: user._id,
            balance: 50000,
            transactions: [{
                type: 'credit',
                amount: 50000,
                description: 'Welcome bonus - Initial wallet balance'
            }]
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const wallet = await Wallet.findOne({ user: req.user._id });

        res.json({
            success: true,
            data: {
                ...user.toObject(),
                walletBalance: wallet ? wallet.balance : 0
            }
        });
    } catch (error) {
        next(error);
    }
};
