import { Link } from 'react-router-dom';
import {
    Plane,
    Search,
    CreditCard,
    FileText,
    Shield,
    ArrowRight,
    Sparkles,
    Clock,
    Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Search,
            title: 'Smart Search',
            description: 'Search across 10+ flights with real-time pricing and availability',
            color: 'primary',
        },
        {
            icon: Sparkles,
            title: 'Dynamic Pricing',
            description: 'Get the best deals with our intelligent surge pricing system',
            color: 'accent',
        },
        {
            icon: Wallet,
            title: 'Digital Wallet',
            description: 'Secure payments with your ₹50,000 pre-loaded wallet balance',
            color: 'secondary',
        },
        {
            icon: FileText,
            title: 'Instant E-Tickets',
            description: 'Download your PDF tickets immediately after booking',
            color: 'primary',
        },
    ];

    const stats = [
        { value: '18+', label: 'Flights Available' },
        { value: '₹50K', label: 'Wallet Balance' },
        { value: '12+', label: 'Cities Covered' },
        { value: '24/7', label: 'Support' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 gradient-mesh opacity-50" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-primary-300">XTechon Flight Booking System</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Dream Flight</span>
                        <br />With Ease
                    </h1>

                    <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 animate-in stagger-1">
                        Experience seamless flight booking with dynamic pricing, instant e-tickets,
                        and a pre-loaded wallet system. Your journey starts here.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in stagger-2">
                        <Link to="/flights" className="btn-primary text-lg px-8 py-4">
                            <Search className="w-5 h-5" />
                            Search Flights
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                                Get Started Free
                            </Link>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-in stagger-3">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass rounded-2xl p-6 text-center">
                                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-dark-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why Choose XTechon Flights?
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto">
                            A complete flight booking solution with all the features you need for a seamless travel experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="card-hover group"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 text-${feature.color}-400`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-dark-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-dark-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-dark-400">Book your flight in just 3 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: Search,
                                title: 'Search Flights',
                                description: 'Enter your departure and arrival cities to find available flights',
                            },
                            {
                                step: '02',
                                icon: CreditCard,
                                title: 'Book & Pay',
                                description: 'Select your flight, fill in details, and pay from your wallet',
                            },
                            {
                                step: '03',
                                icon: FileText,
                                title: 'Get E-Ticket',
                                description: 'Download your PDF ticket instantly after booking',
                            },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="relative">
                                    <div className="card text-center">
                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-bold text-dark-800">
                                            {item.step}
                                        </span>
                                        <div className="relative pt-8">
                                            <div className="w-16 h-16 mx-auto rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mb-4">
                                                <Icon className="w-8 h-8 text-primary-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                            <p className="text-dark-400">{item.description}</p>
                                        </div>
                                    </div>
                                    {index < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                            <ArrowRight className="w-8 h-8 text-dark-700" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 gradient-mesh opacity-30" />
                        <div className="relative">
                            <Plane className="w-16 h-16 mx-auto text-primary-400 mb-6 animate-float" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Take Off?
                            </h2>
                            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
                                Join thousands of travelers who trust XTechon for their flight bookings.
                                Start with ₹50,000 in your wallet!
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/flights" className="btn-primary text-lg px-8 py-4">
                                    Book Your Flight Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-dark-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                            <Plane className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">XTechon Flights</span>
                    </div>
                    <p className="text-dark-400 text-sm">
                        © 2024 XTechon Flight Booking System. Built for Technical Assessment.
                    </p>
                    <div className="flex items-center gap-2 text-dark-400 text-sm">
                        <Shield className="w-4 h-4" />
                        Secure Payments
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
