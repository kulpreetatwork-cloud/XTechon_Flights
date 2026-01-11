import api from './api';

export const walletService = {
    // Get wallet with transactions
    getWallet: async () => {
        const response = await api.get('/wallet');
        return response.data;
    },

    // Get balance only
    getBalance: async () => {
        const response = await api.get('/wallet/balance');
        return response.data;
    },

    // Check if balance is sufficient
    checkBalance: async (amount) => {
        const response = await api.post('/wallet/check', { amount });
        return response.data;
    },

    // Add funds to wallet
    addFunds: async (amount) => {
        const response = await api.post('/wallet/add', { amount });
        return response.data;
    },
};

export default walletService;
