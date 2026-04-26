"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CalendarHeart, Clock, MapPin, ChevronRight, Search, Filter, ArrowLeft, RefreshCw, Star, X, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const router = useRouter();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchBookings();
        }
    }, [status]);

    const submitReview = async () => {
        if (!selectedBookingId || ratingValue === 0) return;
        setSubmittingReview(true);
        try {
            const booking = bookings.find(b => b.id === selectedBookingId);
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: selectedBookingId,
                    sitterId: booking?.sitterId,
                    rating: ratingValue,
                    comment: reviewComment
                })
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(bookings.map(b => b.id === selectedBookingId ? { ...b, review: data.review } : b));
                setRatingModalOpen(false);
                setRatingValue(0);
                setReviewComment("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingReview(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (filter === "all") return true;
        if (filter === "upcoming") return b.status === "Confirmed" || b.status === "Pending";
        if (filter === "completed") return b.status === "Completed";
        if (filter === "cancelled") return b.status === "Cancelled";
        return true;
    });

    if (status === "loading") return null;

    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6">
                
                {/* Header Section */}
                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-primary-main hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">Booking History</h1>
                            <p className="text-gray-500 dark:text-gray-400">Review and manage your past and upcoming pet care sessions.</p>
                        </div>
                        <div className="flex bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {["all", "upcoming", "completed", "cancelled"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary-main text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="flex flex-col gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <RefreshCw className="w-10 h-10 animate-spin text-primary-main mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading History...</p>
                        </div>
                    ) : filteredBookings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredBookings.map((b, idx) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        key={b.id}
                                        onClick={() => router.push(`/sitter/${b.sitterId}`)}
                                        className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light/20 to-secondary-light/20 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0">
                                            <span className="text-2xl font-black text-primary-main uppercase">{b.sitter?.name.charAt(0)}</span>
                                        </div>

                                        <div className="flex-1 text-center md:text-left w-full">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{b.sitter?.name}</h3>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${
                                                    b.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                                    b.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">{b.service}</p>
                                            
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5"><CalendarHeart className="w-4 h-4 text-primary-main" /> {b.date}</div>
                                                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary-main" /> {b.time}</div>
                                                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {b.sitter?.location || "Delhi"}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                                            <div className="text-center md:text-right mb-2">
                                                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₹{b.totalPrice}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Paid</p>
                                            </div>
                                            <Link href={`/book/${b.sitterId}`} className="w-full">
                                                <Button variant="outline" className="w-full font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl hover:bg-primary-main hover:text-white transition-all">
                                                    Rebook Service
                                                </Button>
                                            </Link>
                                            {(b.status === 'Confirmed' || b.status === 'Completed') && (
                                                <Link href={`/videocall/${b.id}`} className="w-full">
                                                    <Button className="w-full font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl bg-primary-main hover:bg-primary-dark text-white transition-all mt-2">
                                                        <Video className="w-4 h-4 mr-2" /> Video Call
                                                    </Button>
                                                </Link>
                                            )}
                                            {b.status === 'Completed' && !b.review && (
                                                <Button 
                                                    onClick={() => {
                                                        setSelectedBookingId(b.id);
                                                        setRatingModalOpen(true);
                                                    }}
                                                    className="w-full font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl bg-secondary-main hover:bg-secondary-dark text-white transition-all mt-2">
                                                    Rate Caregiver
                                                </Button>
                                            )}
                                            {b.status === 'Completed' && b.review && (
                                                <div className="w-full flex items-center justify-center gap-1 py-3 px-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mt-2">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rated</span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < b.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-200" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No Bookings Found</h2>
                            <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm">You don't have any {filter === 'all' ? '' : filter} bookings at the moment.</p>
                            <Link href="/search">
                                <Button className="font-black uppercase tracking-widest px-8 py-4">Find a Sitter Now</Button>
                            </Link>
                        </div>
                    )}
                </div>
                
                {/* Rating Modal */}
                <AnimatePresence>
                    {ratingModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 dark:border-gray-800"
                            >
                                <button 
                                    onClick={() => setRatingModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Rate Your Caregiver</h3>
                                <p className="text-sm text-gray-500 mb-6">How was your experience with this pet care session?</p>
                                
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRatingValue(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-10 h-10 ${ratingValue >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-700"}`} />
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Review (Optional)</label>
                                    <textarea 
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-main outline-none min-h-[100px] resize-none"
                                    ></textarea>
                                </div>
                                
                                <Button 
                                    onClick={submitReview}
                                    disabled={ratingValue === 0 || submittingReview}
                                    className="w-full font-black uppercase tracking-widest py-4 rounded-xl shadow-lg"
                                >
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
