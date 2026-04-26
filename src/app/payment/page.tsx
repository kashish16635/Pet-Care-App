"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CreditCard, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";

function PaymentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const amount = searchParams.get("amount") || "800";
    
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingId) {
            alert("No booking specified.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    amount: parseInt(amount) + 40, // include platform fee
                    method: paymentMethod
                })
            });

            if (res.ok) {
                router.push(`/dashboard?success=true`);
            } else {
                alert("Payment failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 pt-24 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
            <div className="flex-[1.5]">
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>
                <form onSubmit={handlePayment} className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select Payment Method</h2>
                    
                    <div className="space-y-4 mb-8">
                        {/* UPI Option */}
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary-main bg-primary-light/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="upi"
                                checked={paymentMethod === 'upi'}
                                onChange={() => setPaymentMethod('upi')}
                                className="w-5 h-5 text-primary-main border-gray-300 focus:ring-primary-main"
                            />
                            <div className="ml-4 flex-1 flex justify-between items-center">
                                <div>
                                    <span className="block font-bold text-gray-900 dark:text-white">UPI (Google Pay, PhonePe, Paytm)</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instant, zero fee.</span>
                                </div>
                                <Wallet className="w-6 h-6 text-gray-400" />
                            </div>
                        </label>

                        {/* Cards Option */}
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-main bg-primary-light/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="w-5 h-5 text-primary-main border-gray-300 focus:ring-primary-main"
                            />
                            <div className="ml-4 flex-1 flex justify-between items-center">
                                <div>
                                    <span className="block font-bold text-gray-900 dark:text-white">Credit / Debit Card</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visa, MasterCard, RuPay.</span>
                                </div>
                                <CreditCard className="w-6 h-6 text-gray-400" />
                            </div>
                        </label>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                                    <input type="password" placeholder="123" maxLength={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none dark:text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'upi' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-300">
                            You will be redirected to your UPI app (Google Pay, PhonePe, Paytm) to complete the payment.
                        </div>
                    )}

                    <Button size="lg" type="submit" className="w-full h-14 text-lg" disabled={loading}>
                        {loading ? "Processing Secure Payment..." : `Pay ₹${parseInt(amount) + 40}`}
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Secure 256-bit encrypted payment
                    </p>
                </form>
            </div>

            <div className="flex-1">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Selected Service</p>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">₹{amount}</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{amount}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Platform Fee</span>
                            <span>₹40</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white mb-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <span>Total to Pay</span>
                        <span className="text-primary-main">₹{parseInt(amount) + 40}</span>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-xl text-sm flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>Free cancellation up to 24 hours before the booking starts.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment securely...</div>}>
                <PaymentForm />
            </Suspense>
            <Footer />
        </div>
    );
}
