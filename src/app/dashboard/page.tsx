"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CalendarHeart, MapPin, Clock, CreditCard, ChevronRight, Bell, Loader2, Video, X, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function DashboardContent() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    const fetchDashboardData = () => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
                
                // Show upgrade prompt if user has 3+ total bookings and isn't pro
                const totalBookings = (d.pastBookings?.length || 0) + (d.upcomingBooking ? 1 : 0);
                if (totalBookings >= 3) {
                    // Only show once per session to avoid annoyance
                    const hasSeen = sessionStorage.getItem("hasSeenUpgradePrompt");
                    if (!hasSeen) {
                        setShowUpgradePrompt(true);
                        sessionStorage.setItem("hasSeenUpgradePrompt", "true");
                    }
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchDashboardData();
        }
    }, [status]);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "PUT"
            });
            if (res.ok) {
                alert("Booking cancelled successfully.");
                fetchDashboardData(); // Refresh data
            } else {
                alert("Failed to cancel booking.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleContact = (name: string) => {
        alert(`Contacting ${name}...\nPhone: +91 98765-43210\n(Messaging system coming soon!)`);
    };

    if (status === "loading" || loading) {
        return <div className="flex-1 flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary-main" /></div>;
    }

    if (status === "unauthenticated") {
        return <div className="flex-1 flex flex-col justify-center items-center min-h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Please log in to view your dashboard</h2>
            <Link href="/login"><Button>Log In</Button></Link>
        </div>;
    }

    const { upcomingBooking, pastBookings, balance, notifications } = data;

    return (
        <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6">

            {isSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 p-4 rounded-2xl mb-8 flex items-center justify-between animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                        <p className="font-medium">Booking Confirmed! The sitter has been notified.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Welcome back, {session?.user?.name?.split(" ")[0]}! 👋</h1>
                    <p className="text-gray-500 dark:text-gray-400">Here's an overview of your pet care activities.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/profile">
                        <Button variant="outline" className="hidden sm:flex">My Pets & Profile</Button>
                    </Link>
                    <Link href="/search">
                        <Button><CalendarHeart className="w-5 h-5 mr-2" /> Book New Service</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* Upcoming Active Booking */}
                    {upcomingBooking && (
                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Booking</h2>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    upcomingBooking.status === "Pending" 
                                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
                                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                }`}>
                                    {upcomingBooking.status}
                                </div>
                            </div>

                            <div 
                                onClick={() => router.push(`/sitter/${upcomingBooking.sitterId}`)}
                                className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer group transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-secondary-light shrink-0 flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-2xl font-bold text-primary-main group-hover:scale-110 transition-transform">{upcomingBooking.sitter?.name.charAt(0) || "S"}</span>
                                </div>

                                <div className="flex-1 w-full">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-main transition-colors">{upcomingBooking.sitter?.name || "Sitter"}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-3">{upcomingBooking.service}</p>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5"><CalendarHeart className="w-4 h-4 text-primary-main" /> {upcomingBooking.date}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary-main" /> {upcomingBooking.time}</div>
                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {upcomingBooking.sitter?.location || "Your Location"}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0" onClick={(e) => e.stopPropagation()}>
                                    {(upcomingBooking.status === "Confirmed" || upcomingBooking.status === "Completed") && (
                                        <Link href={`/videocall/${upcomingBooking.id}`}>
                                            <Button className="w-full sm:w-auto font-bold bg-primary-main hover:bg-primary-dark text-white">
                                                <Video className="w-4 h-4 mr-2" /> Video Call
                                            </Button>
                                        </Link>
                                    )}
                                    <Button variant="outline" className="w-full sm:w-auto font-bold" onClick={() => handleContact(upcomingBooking.sitter?.name)}>Contact</Button>
                                    <Button variant="ghost" className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold" onClick={() => handleCancel(upcomingBooking.id)}>Cancel</Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Past Bookings */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Past Care</h2>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {pastBookings?.length === 0 && <p className="text-gray-500 py-4">No past bookings found.</p>}
                            {pastBookings?.map((b: any) => (
                                <div 
                                    key={b.id} 
                                    onClick={() => router.push(`/sitter/${b.sitterId}`)}
                                    className="py-4 flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-xl transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <span className="font-bold text-gray-500 dark:text-gray-400">{b.sitter?.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-main transition-colors">{b.sitter?.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{b.service} • {b.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {b.status === "Completed" && (
                                            <Link href={`/videocall/${b.id}`} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" className="p-2 h-auto text-primary-main hover:bg-primary-light/20">
                                                    <Video className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={`/book/${b.sitterId}`} onClick={(e) => e.stopPropagation()}>
                                            <Button variant="outline" size="sm" className="hidden sm:flex font-bold rounded-xl hover:bg-primary-main hover:text-white transition-all">Rebook</Button>
                                        </Link>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pastBookings?.length > 0 && (
                            <Link href="/history">
                                <Button variant="link" className="mt-4 p-0 font-bold text-primary-main hover:underline decoration-2 underline-offset-4">
                                    View all history →
                                </Button>
                            </Link>
                        )}
                    </section>
                </div>

                {/* Sidebar Area */}
                <div className="flex flex-col gap-8">
                    {/* Wallet & Payments */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/50 dark:bg-primary-main/20 rounded-bl-full -z-10" />
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Paws Wallet</h3>
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Available Balance</p>
                        <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">₹{balance?.toLocaleString()}</p>

                        <div className="flex gap-2">
                            <Link href="/wallet" className="w-full">
                                <Button className="w-full" size="sm">Open Wallet</Button>
                            </Link>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                            <div className="relative">
                                <Bell className="w-5 h-5 text-gray-400" />
                                {notifications?.filter((n: any) => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {notifications?.length === 0 && <p className="text-gray-500 text-sm">No new notifications.</p>}
                            {notifications?.map((n: any) => (
                                <div key={n.id} className="flex gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary-main'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{n.type === "success" ? "Alert" : "Reminder"}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('open-notifications-drawer'))}
                            className="block mt-6 w-full h-10 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-center"
                        >
                            View All Notifications →
                        </button>
                    </section>
                </div>
            </div>
            {/* Upgrade Modal */}
            <AnimatePresence>
                {showUpgradePrompt && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUpgradePrompt(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setShowUpgradePrompt(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-gradient-brand rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary-main/20 mb-8 rotate-3">
                                    <Crown className="w-10 h-10 text-white" />
                                </div>
                                
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">You're a Regular! 🐾</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                                    Since you've made { (data.pastBookings?.length || 0) + (data.upcomingBooking ? 1 : 0) } bookings, why not upgrade to **Pro**? Get unlimited bookings, zero service fees, and priority support.
                                </p>

                                <div className="space-y-3">
                                    <Link href="/subscription" onClick={() => setShowUpgradePrompt(false)}>
                                        <Button className="w-full py-7 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-main/20">Upgrade Now — Save 20%</Button>
                                    </Link>
                                    <button 
                                        onClick={() => setShowUpgradePrompt(false)}
                                        className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-main/5 rounded-full blur-3xl" />
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-main/5 rounded-full blur-3xl" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center p-24">
                    <div className="w-10 h-10 border-4 border-primary-light border-t-primary-main rounded-full animate-spin" />
                </div>
            }>
                <DashboardContent />
            </Suspense>
            <Footer />
        </div>
    );
}
