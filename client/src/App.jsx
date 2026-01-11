import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Bookings from './pages/Bookings';
import BookingSuccess from './pages/BookingSuccess';
import WalletPage from './pages/WalletPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Guest Route (redirect if logged in)
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/flights" replace />;
    }

    return children;
};

function AppContent() {
    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flights" element={<Flights />} />
                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute>
                            <Bookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/booking-success"
                    element={
                        <ProtectedRoute>
                            <BookingSuccess />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute>
                            <WalletPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#f1f5f9',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#1e293b',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#1e293b',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </Router>
    );
}

export default App;
