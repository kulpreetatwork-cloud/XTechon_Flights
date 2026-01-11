import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Plus,
    Clock,
    Plane
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';
import toast from 'react-hot-toast';

const WalletPage = () => {
    const { walletBalance, refreshWallet } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingFunds, setAddingFunds] = useState(false);
    const [addAmount, setAddAmount] = useState('');

    useEffect(() => {
        loadWallet();
    }, []);

    const loadWallet = async () => {
        try {
            const response = await walletService.getWallet();
            if (response.success) {
                setTransactions(response.data.transactions || []);
            }
        } catch (error) {
            console.error('Failed to load wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async (e) => {
        e.preventDefault();
        const amount = parseFloat(addAmount);

        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setAddingFunds(true);
        try {
            await walletService.addFunds(amount);
            await refreshWallet();
            await loadWallet();
            toast.success(`₹${amount.toLocaleString('en-IN')} added to wallet!`);
            setAddAmount('');
        } catch (error) {
            toast.error('Failed to add funds');
        } finally {
            setAddingFunds(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-secondary-400" />
                        My Wallet
                    </h1>
                    <p className="text-dark-400 mt-1">Manage your wallet balance and view transactions</p>
                </div>

                {/* Balance Card */}
                <div className="glass-dark rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 gradient-mesh opacity-30" />
                    <div className="relative">
                        <p className="text-dark-400 mb-2">Available Balance</p>
                        <p className="text-5xl font-bold text-white mb-6">
                            ₹{walletBalance.toLocaleString('en-IN')}
                        </p>

                        {/* Quick Add Funds */}
                        <form onSubmit={handleAddFunds} className="flex gap-3">
                            <div className="relative flex-1 max-w-xs">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">₹</span>
                                <input
                                    type="number"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="input pl-8"
                                    min="1"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addingFunds}
                                className="btn-primary"
                            >
                                {addingFunds ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Add Funds
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Decorative */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl" />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link to="/flights" className="card-hover flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Book Flight</p>
                            <p className="text-sm text-dark-400">Search available flights</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-dark-400 ml-auto" />
                    </Link>

                    <Link to="/bookings" className="card-hover flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-accent-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Booking History</p>
                            <p className="text-sm text-dark-400">View past bookings</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-dark-400 ml-auto" />
                    </Link>
                </div>

                {/* Transaction History */}
                <div className="glass-dark rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8 text-dark-400">
                            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No transactions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'credit'
                                                ? 'bg-secondary-500/10'
                                                : 'bg-red-500/10'
                                            }`}>
                                            {tx.type === 'credit' ? (
                                                <TrendingUp className="w-5 h-5 text-secondary-400" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{tx.description}</p>
                                            <p className="text-sm text-dark-400">{formatDate(tx.created_at)}</p>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-semibold ${tx.type === 'credit' ? 'text-secondary-400' : 'text-red-400'
                                        }`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
