"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaregiverNavbar } from "@/components/CaregiverNavbar";
import { Footer } from "@/components/Footer";
import { Calendar, CheckCircle, XCircle, Clock, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CaregiverBookings() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // useEffect ka use tab hota hai jab page load hota hai
    useEffect(() => {
        // Agar user login nahi hai (unauthenticated), toh use login page par bhej do
        if (status === "unauthenticated") {
            router.push("/caregiver/login");
        } 
        // Agar user login hai aur uska role 'CAREGIVER' hai, toh uski bookings fetch karo
        else if (status === "authenticated" && session?.user?.role === "CAREGIVER") {
            fetchBookings();
        }
    }, [status, session]);

    // Ye function database se saari bookings mangwane ke liye hai
    const fetchBookings = async () => {
        try {
            // API call kar rahe hain caregiver ki details aur bookings lene ke liye
            const res = await fetch("/api/caregiver/profile");
            if (res.ok) {
                const data = await res.json();
                // Data milne par hum 'bookings' state mein use save kar lete hain
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Data load hone ke baad 'loading' ko false kar dete hain taaki spinner ruk jaye
            setLoading(false);
        }
    };

    // Ye function booking status (Accept/Reject/Complete) update karne ke liye hai
    const updateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/bookings", {
                method: "PATCH", // PATCH matlab data ka ek hissa update karna
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status: newStatus }),
            });

            if (res.ok) {
                // Agar update success ho gaya, toh list ko refresh kar do
                fetchBookings();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }  
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading Bookings...</div>;
    }

    const pendingBookings = bookings.filter(b => b.status === "Pending");
    const activeBookings = bookings.filter(b => b.status === "Confirmed");
    const pastBookings = bookings.filter(b => b.status === "Completed" || b.status === "Cancelled");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <CaregiverNavbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Booking Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your client appointments</p>
                </div>

                <div className="space-y-10">
                    {/* Pending Requests */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" /> Action Required ({pendingBookings.length})
                        </h2>
                        {pendingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {pendingBookings.map(booking => (
                                    <div key={booking.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shrink-0">
                                                <Calendar className="w-6 h-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{booking.service}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Date: {booking.date} at {booking.time}</p>
                                                {booking.instructions && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 italic">"{booking.instructions}"</p>}
                                                <p className="font-bold text-primary-main mt-2">₹{booking.totalPrice}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 sm:flex-col lg:flex-row shrink-0">
                                            <Button onClick={() => updateBookingStatus(booking.id, "Confirmed")} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                                                <CheckCircle className="w-4 h-4 mr-2" /> Accept
                                            </Button>
                                            <Button onClick={() => updateBookingStatus(booking.id, "Cancelled")} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">
                                                <XCircle className="w-4 h-4 mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-gray-500 dark:text-gray-400">
                                No pending requests at the moment.
                            </div>
                        )}
                    </section>

                    {/* Active/Confirmed Bookings */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Upcoming & Active ({activeBookings.length})
                        </h2>
                        {activeBookings.length > 0 ? (
                            <div className="space-y-4">
                                {activeBookings.map(booking => (
                                    <div key={booking.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
                                                <Calendar className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{booking.service}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Date: {booking.date} at {booking.time}</p>
                                                {booking.instructions && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 italic whitespace-pre-wrap border-l-2 border-primary-main/30 pl-3">"{booking.instructions}"</p>}
                                                <p className="font-bold text-primary-main mt-2">₹{booking.totalPrice}</p>


                                            </div>
                                        </div>
                                        <div className="shrink-0 flex flex-col gap-2">
                                            <Link href={`/videocall/${booking.id}`}>
                                                <Button variant="outline" className="w-full border-primary-main text-primary-main hover:bg-primary-main hover:text-white font-bold">
                                                    <Video className="w-4 h-4 mr-2" /> Join Video Call
                                                </Button>
                                            </Link>

                                            <Button onClick={() => updateBookingStatus(booking.id, "Completed")} className="bg-primary-main hover:bg-primary-dark text-white font-bold">
                                                Mark Completed
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-gray-500 dark:text-gray-400">
                                No active bookings right now.
                            </div>
                        )}
                    </section>

                    {/* Past Bookings */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Past Bookings</h2>
                        {pastBookings.length > 0 ? (
                            <div className="space-y-4 opacity-75">
                                {pastBookings.map(booking => (
                                    <div key={booking.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{booking.service}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">Date: {booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className={`font-bold text-sm px-3 py-1 rounded-full inline-block ${booking.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {booking.status}
                                            </p>
                                            <Link href={`/videocall/${booking.id}`}>
                                                <Button variant="link" size="sm" className="p-0 h-auto text-xs font-bold text-primary-main hover:underline">
                                                    <Video className="w-3 h-3 mr-1" /> Reconnect Call
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
