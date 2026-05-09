"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { MessageSquareHeart, Star, Send, ChevronLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Overall Experience", "Booking Process", "Pet Sitter Quality", "App & Website", "Support Team", "Other"];

export default function FeedbackPage() {
    const [category, setCategory] = useState("Overall Experience");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) { alert("Please select a rating."); return; }
        if (!message.trim()) { alert("Please enter your feedback message."); return; }

        setLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-16 w-full max-w-2xl mx-auto px-4 sm:px-6">
                {/* Back Link */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-main transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-main to-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary-main/25">
                                    <MessageSquareHeart className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Share Your Feedback</h1>
                                <p className="text-gray-500 dark:text-gray-400">Your thoughts help us improve PawCare for everyone 🐾</p>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-8">

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                type="button"
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all ${
                                                    category === cat
                                                        ? "border-primary-main bg-primary-light text-primary-main dark:bg-primary-main/20"
                                                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-main/50"
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <label className="block text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">
                                        Rating
                                        {(hoverRating || rating) > 0 && (
                                            <span className="ml-3 text-amber-500 normal-case tracking-normal font-bold">
                                                — {ratingLabels[hoverRating || rating]}
                                            </span>
                                        )}
                                    </label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button
                                                type="button"
                                                key={s}
                                                onClick={() => setRating(s)}
                                                onMouseEnter={() => setHoverRating(s)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star className={`w-10 h-10 transition-colors ${
                                                    s <= (hoverRating || rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-200 dark:text-gray-700"
                                                }`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Your Feedback</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Tell us what you loved, or what we can improve..."
                                        rows={5}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-primary-main transition-colors text-sm font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-2 text-right">{message.length}/500</p>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 text-sm font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary-main/20"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Feedback
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">Thank You! 🎉</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto">
                                We appreciate your feedback. It helps us build a better experience for all pet lovers.
                            </p>
                            <Link href="/dashboard">
                                <Button className="px-10 rounded-2xl shadow-lg shadow-primary-main/20">
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
