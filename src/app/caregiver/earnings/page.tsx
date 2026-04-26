"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CaregiverNavbar } from "@/components/CaregiverNavbar";
import { Footer } from "@/components/Footer";
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CaregiverEarnings() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/caregiver/login");
        } else if (status === "authenticated" && session?.user?.role === "CAREGIVER") {
            fetchProfile();
        }
    }, [status, session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/caregiver/profile");
            if (res.ok) {
                const data = await res.json();
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading Earnings...</div>;
    }

    const completedBookings = bookings.filter(b => b.status === "Completed");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <CaregiverNavbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Earnings</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your income and payment history</p>
                    </div>
                    <Button variant="outline" className="font-bold border-gray-200 dark:border-gray-700">
                        Download Report
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Earnings Card */}
                    <div className="md:col-span-2 bg-gradient-brand rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
                            <IndianRupee className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/80 font-medium mb-1">Total Lifetime Earnings</p>
                            <h2 className="text-5xl font-bold tracking-tight">₹{totalEarnings.toLocaleString()}</h2>
                            
                            <div className="mt-8 flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">+12% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                            <ArrowUpRight className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed Jobs</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{completedBookings.length}</h3>
                    </div>
                </div>

                {/* Transaction History */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
                
                {completedBookings.length > 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {completedBookings.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(booking => (
                                <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-light/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Calendar className="w-6 h-6 text-primary-main" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{booking.service}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Completed on {new Date(booking.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-green-600 dark:text-green-500">+₹{booking.totalPrice}</p>
                                        <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Paid</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IndianRupee className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">No earnings yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Complete your first booking to start earning!</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
