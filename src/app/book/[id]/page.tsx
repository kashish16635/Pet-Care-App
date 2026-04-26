"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [bookingData, setBookingData] = useState({
        service: "Pet Sitting",
        date: "",
        time: "",
        petName: "",
        instructions: ""
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (status !== "authenticated") {
            router.push("/login?redirect=/book/" + id);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sitterId: id,
                    ...bookingData,
                    totalPrice: 800 // Hardcoded base price, usually fetched via sitter object
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                router.push(`/payment?bookingId=${data.booking.id}&amount=800`);
            } else {
                alert("Booking step failed. Check console.");
            }
        } catch (error) {
            console.error("Booking failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-3xl mx-auto px-4 sm:px-6">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Complete Your Booking</h1>
                    <p className="text-gray-500 dark:text-gray-400">Step {step} of 3</p>

                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-4 max-w-md mx-auto">
                        <div
                            className="bg-primary-main h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800">

                    {/* STEP 1: Service Details */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Service Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Service</label>
                                    <select
                                        value={bookingData.service}
                                        onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white"
                                    >
                                        <option value="Pet Sitting">Pet Sitting (At your home)</option>
                                        <option value="Dog Walking">Dog Walking (30-60 mins)</option>
                                        <option value="Boarding">Boarding (Overnight)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="date"
                                                value={bookingData.date}
                                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="time"
                                                value={bookingData.time}
                                                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <Button size="lg" onClick={handleNext} disabled={!bookingData.date || !bookingData.time}>
                                    Next Step
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Pet Info */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">About Your Pet</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pet's Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Max, Bella"
                                        value={bookingData.petName}
                                        onChange={(e) => setBookingData({ ...bookingData, petName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions / Medical Needs</label>
                                    <textarea
                                        rows={4}
                                        placeholder="E.g., Needs medication at 2 PM. Allergic to chicken."
                                        value={bookingData.instructions}
                                        onChange={(e) => setBookingData({ ...bookingData, instructions: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-10 flex justify-between">
                                <Button variant="outline" size="lg" onClick={handleBack}>Back</Button>
                                <Button size="lg" onClick={handleNext} disabled={!bookingData.petName}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Review summary */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Review Summary</h2>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">Service</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{bookingData.service}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{bookingData.date} at {bookingData.time}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">Pet</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{bookingData.petName}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Estimated Total</span>
                                    <span className="text-xl font-bold text-primary-main">₹800</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 mb-8 p-4 bg-primary-light/30 dark:bg-primary-main/10 rounded-xl text-primary-main dark:text-primary-light text-sm">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>You won't be charged securely until confirmed via Paws Wallet.</p>
                            </div>

                            <div className="mt-10 flex justify-between items-center">
                                <Button variant="ghost" size="lg" onClick={handleBack} disabled={loading}>Back</Button>
                                <form onSubmit={handleSubmit}>
                                    <Button size="lg" type="submit" disabled={loading} className="w-48">
                                        {loading ? "Processing..." : "Continue to Payment"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
