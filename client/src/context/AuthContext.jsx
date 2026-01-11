import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import walletService from '../services/walletService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (authService.isAuthenticated()) {
                const storedUser = authService.getUser();
                setUser(storedUser);
                try {
                    const response = await walletService.getBalance();
                    if (response.success) {
                        setWalletBalance(response.data.balance);
                    }
                } catch (error) {
                    console.error('Failed to fetch wallet:', error);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response.success) {
            setUser(response.data);
            // Fetch wallet balance
            const walletResponse = await walletService.getBalance();
            if (walletResponse.success) {
                setWalletBalance(walletResponse.data.balance);
            }
        }
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        if (response.success) {
            setUser(response.data);
            setWalletBalance(50000); // Default balance
        }
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setWalletBalance(0);
    };

    const refreshWallet = async () => {
        try {
            const response = await walletService.getBalance();
            if (response.success) {
                setWalletBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Failed to refresh wallet:', error);
        }
    };

    const updateWalletBalance = (newBalance) => {
        setWalletBalance(newBalance);
    };

    const value = {
        user,
        walletBalance,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshWallet,
        updateWalletBalance,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
