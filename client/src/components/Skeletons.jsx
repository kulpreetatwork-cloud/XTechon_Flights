// Skeleton loading components for premium feel

export const FlightCardSkeleton = () => (
    <div className="card animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Airline Info */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-dark-700" />
                <div>
                    <div className="h-5 w-24 bg-dark-700 rounded mb-2" />
                    <div className="h-4 w-16 bg-dark-800 rounded" />
                </div>
            </div>

            {/* Route Info */}
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="h-7 w-16 bg-dark-700 rounded mb-2" />
                        <div className="h-4 w-20 bg-dark-800 rounded" />
                    </div>
                    <div className="flex-1 flex items-center">
                        <div className="h-px flex-1 bg-dark-700" />
                        <div className="w-6 h-6 bg-dark-700 rounded mx-2" />
                        <div className="h-px flex-1 bg-dark-700" />
                    </div>
                    <div className="text-center">
                        <div className="h-7 w-16 bg-dark-700 rounded mb-2" />
                        <div className="h-4 w-20 bg-dark-800 rounded" />
                    </div>
                </div>
            </div>

            {/* Price & Book */}
            <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                <div>
                    <div className="h-8 w-24 bg-dark-700 rounded mb-1" />
                    <div className="h-3 w-16 bg-dark-800 rounded" />
                </div>
                <div className="h-12 w-28 bg-dark-700 rounded-xl" />
            </div>
        </div>
    </div>
);

export const BookingCardSkeleton = () => (
    <div className="card animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark-700" />
                <div>
                    <div className="h-5 w-32 bg-dark-700 rounded mb-2" />
                    <div className="h-4 w-24 bg-dark-800 rounded" />
                </div>
            </div>
            <div className="h-6 w-20 bg-dark-700 rounded-full" />
        </div>
        <div className="p-4 bg-dark-800/50 rounded-xl mb-4">
            <div className="h-5 w-40 bg-dark-700 rounded mb-3" />
            <div className="flex items-center justify-between">
                <div className="h-12 w-20 bg-dark-700 rounded" />
                <div className="h-12 w-20 bg-dark-700 rounded" />
            </div>
        </div>
        <div className="flex justify-between pt-4 border-t border-dark-700">
            <div className="h-4 w-32 bg-dark-800 rounded" />
            <div className="h-10 w-36 bg-dark-700 rounded-xl" />
        </div>
    </div>
);

export const WalletSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 w-48 bg-dark-700 rounded mb-2" />
        <div className="h-12 w-64 bg-dark-600 rounded" />
    </div>
);

export default { FlightCardSkeleton, BookingCardSkeleton, WalletSkeleton };
