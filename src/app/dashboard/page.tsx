"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { 
    CalendarHeart, MapPin, Clock, CreditCard, ChevronRight, 
    Bell, Loader2, Video, ShieldCheck, Heart, MessageCircle, 
    Smartphone, Star, Camera, Trash2, Shield, Zap, CheckCircle2,
    Plus, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function DashboardContent() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Health Center States
    const [healthRecords, setHealthRecords] = useState({
        vaccines: [
            { id: 1, name: "Rabies Vaccine", date: "2026-06-15", status: "Soon", color: "orange" },
            { id: 2, name: "DHPP Booster", date: "2026-08-22", status: "Scheduled", color: "green" }
        ],
        medical: [
            { id: 1, title: "Annual Health Checkup", desc: "Dr. Kapoor • All vitals normal", date: "2026-03-12" }
        ]
    });
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ type: "vaccine", name: "", date: "", desc: "" });

    // Review Modal States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("petHealthRecords");
        if (saved) setHealthRecords(JSON.parse(saved));
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/dashboard");
            if (res.ok) {
                const data = await res.json();
                setData(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchDashboardData();
        }
    }, [status]);

    const addHealthRecord = () => {
        if (!newRecord.name || !newRecord.date) {
            alert("Please fill all required fields!");
            return;
        }
        
        const updated = { ...healthRecords };
        if (newRecord.type === "vaccine") {
            updated.vaccines = [
                { id: Date.now(), name: newRecord.name, date: newRecord.date, status: "Scheduled", color: "blue" },
                ...updated.vaccines
            ];
        } else {
            updated.medical = [
                { id: Date.now(), title: newRecord.name, desc: newRecord.desc, date: newRecord.date },
                ...updated.medical
            ];
        }
        
        setHealthRecords(updated);
        localStorage.setItem("petHealthRecords", JSON.stringify(updated));
        setShowHealthModal(false);
        setNewRecord({ type: "vaccine", name: "", date: "", desc: "" });
    };

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PUT" });
            if (res.ok) {
                alert("Booking cancelled successfully.");
                fetchDashboardData();
            }
        } catch (error) { console.error(error); }
    };

    const handleSubmitReview = async () => {
        if (!selectedBooking) return;
        setReviewLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: selectedBooking.id, sitterId: selectedBooking.sitterId, rating, comment, photos })
            });
            if (res.ok) {
                alert("Thank you for your review!");
                setShowReviewModal(false);
                fetchDashboardData();
            }
        } catch (error) { alert("An error occurred"); } finally { setReviewLoading(false); }
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

    const { upcomingBooking, pastBookings, balance } = data;

    return (
        <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Health Modal */}
            <AnimatePresence>
                {showHealthModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowHealthModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <button onClick={() => setShowHealthModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Add Health Record</h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Type</label>
                                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <button onClick={() => setNewRecord({...newRecord, type: 'vaccine'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newRecord.type === 'vaccine' ? 'bg-white dark:bg-gray-700 shadow-sm text-rose-500' : 'text-gray-400'}`}>Vaccine</button>
                                        <button onClick={() => setNewRecord({...newRecord, type: 'medical'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newRecord.type === 'medical' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-500' : 'text-gray-400'}`}>Medical</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Name</label>
                                    <input type="text" value={newRecord.name} onChange={(e) => setNewRecord({...newRecord, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Date</label>
                                    <input type="date" value={newRecord.date} onChange={(e) => setNewRecord({...newRecord, date: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold" />
                                </div>
                                {newRecord.type === 'medical' && (
                                    <textarea placeholder="Note..." value={newRecord.desc} onChange={(e) => setNewRecord({...newRecord, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold h-24" />
                                )}
                                <Button onClick={addHealthRecord} className="w-full py-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs">Save Record</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {isSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 p-4 rounded-2xl mb-8 flex items-center justify-between">
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
                    <Link href="/profile"><Button variant="outline" className="hidden sm:flex">My Pets & Profile</Button></Link>
                    <Link href="/search"><Button><CalendarHeart className="w-5 h-5 mr-2" /> Book New Service</Button></Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* Upcoming Booking */}
                    {upcomingBooking && (
                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Booking</h2>
                            <div onClick={() => router.push(`/sitter/${upcomingBooking.sitterId}`)} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer group transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center shadow-sm">
                                    <span className="text-2xl font-bold text-primary-main">{upcomingBooking.sitter?.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{upcomingBooking.sitter?.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-3">{upcomingBooking.service}</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5"><CalendarHeart className="w-4 h-4 text-primary-main" /> {upcomingBooking.date}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary-main" /> {upcomingBooking.time}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                                    <Link href={`/tracking/${upcomingBooking.id}`}><Button size="sm" className="bg-indigo-600">Track</Button></Link>
                                    <Link href={`/videocall/${upcomingBooking.id}`}><Button size="sm">Call</Button></Link>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Past Care */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Past Care</h2>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {pastBookings?.map((b: any) => (
                                <div key={b.id} className="py-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500">{b.sitter?.name.charAt(0)}</div>
                                        <div><p className="font-bold text-gray-900 dark:text-white">{b.sitter?.name}</p><p className="text-xs text-gray-500">{b.service} • {b.date}</p></div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/book/${b.sitterId}`)}>Rebook</Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pet Health Center - FUNCTIONAL */}
                    <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Shield className="w-5 h-5 text-rose-500" /> Pet Health Center</h2>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Medical Records & Vaccinations</p>
                            </div>
                            <Button onClick={() => setShowHealthModal(true)} variant="ghost" className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-100">Add Record +</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-orange-500" /> Vaccination Tracker</h3>
                                <div className="space-y-3">
                                    {healthRecords.vaccines.map((v: any) => (
                                        <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <div><p className="text-sm font-bold text-gray-900 dark:text-white">{v.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase">Due: {v.date}</p></div>
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${v.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{v.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-blue-500" /> Recent Records</h3>
                                <div className="space-y-3">
                                    {healthRecords.medical.map((m: any) => (
                                        <div key={m.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-blue-500 shadow-sm"><CheckCircle2 className="w-5 h-5" /></div>
                                            <div><p className="text-sm font-bold text-gray-900 dark:text-white">{m.title}</p><p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">{m.desc}</p><p className="text-[9px] text-gray-400 font-black uppercase mt-2">{m.date}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-8">
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Paws Wallet</h3><CreditCard className="w-5 h-5 text-gray-400" /></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Available Balance</p>
                        <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">₹{balance?.toLocaleString()}</p>
                        <Link href="/wallet"><Button className="w-full" size="sm">Open Wallet</Button></Link>
                    </section>
                    
                    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950/20 rounded-3xl p-6 border border-indigo-100">
                        <h3 className="text-md font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-tight mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5" /> Travel Stress-Free</h3>
                        <p className="text-[11px] font-bold text-indigo-700/70 dark:text-indigo-300/60 leading-relaxed">Join thousands of frequent travelers who trust us for total peace of mind.</p>
                    </section>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-md p-10 border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase text-center mb-6">Rate Experience</h3>
                            <div className="flex justify-center gap-2 mb-8">
                                {[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)}><Star className={`w-10 h-10 ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} /></button>)}
                            </div>
                            <textarea placeholder="Tell us more..." value={comment} onChange={e => setComment(e.target.value)} className="w-full px-6 py-4 rounded-3xl bg-gray-50 dark:bg-gray-800 mb-6 h-32" />
                            <div className="flex gap-4">
                                <Button variant="ghost" className="flex-1" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                                <Button onClick={handleSubmitReview} disabled={reviewLoading} className="flex-1 bg-amber-500 text-white shadow-lg shadow-amber-500/20">{reviewLoading ? "..." : "Submit"}</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-main" /></div>}>
                <DashboardContent />
            </Suspense>
            <Footer />
        </div>
    );
}
