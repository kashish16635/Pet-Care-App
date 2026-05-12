"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CaregiverNavbar } from "@/components/CaregiverNavbar";
import { Footer } from "@/components/Footer";
import { MapPin, Star, DollarSign, Calendar, Edit3, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CaregiverDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/caregiver/login");
        } else if (status === "authenticated") {
            if (session?.user?.role !== "CAREGIVER") {
                router.push("/");
            } else {
                fetchProfile();
            }
        }
    }, [status, session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/caregiver/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <CaregiverNavbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Partner Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your pet care business</p>
                    </div>
                    <Button variant="outline" className="font-bold" onClick={() => router.push('/caregiver/profile')}>
                        <Settings className="w-4 h-4 mr-2" /> Settings
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Profile Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-brand opacity-20"></div>
                            <div className="relative pt-8 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-900 mb-4">
                                    {profile?.name?.charAt(0) || "C"}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                                <p className="text-sm font-semibold text-primary-main bg-primary-light/30 px-3 py-1 rounded-full mt-2">
                                    {profile?.type}
                                </p>
                                
                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                        {profile?.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <DollarSign className="w-4 h-4 mr-3 text-gray-400" />
                                        ₹{profile?.price} / day
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Star className="w-4 h-4 mr-3 text-yellow-500 fill-yellow-500" />
                                        {profile?.rating} Rating ({profile?.reviews} reviews)
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => router.push('/caregiver/profile')}
                                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹0</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>


                    </div>

                    {/* Right: Bookings & Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Booking Requests</h3>
                                <Button variant="ghost" size="sm" className="text-primary-main" onClick={() => router.push('/caregiver/bookings')}>View All</Button>
                            </div>

                            {profile?.bookings && profile.bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.bookings.map((booking: any) => (
                                        <div key={booking.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary-light/20 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-primary-main" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{booking.service}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{booking.date} at {booking.time}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">₹{booking.totalPrice}</p>
                                                <p className="text-xs font-semibold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full inline-block mt-1">{booking.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <Calendar className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <h4 className="text-gray-900 dark:text-white font-bold mb-1">No bookings yet</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Your upcoming booking requests will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
