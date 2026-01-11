import express from 'express';
import {
    getWallet,
    getBalance,
    checkBalance,
    addFunds
} from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All wallet routes are protected
router.use(protect);

router.get('/', getWallet);
router.get('/balance', getBalance);
router.post('/check', checkBalance);
router.post('/add', addFunds);

export default router;
