"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawPrint, Mail, Lock, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (otp !== "1234") {
            setError("Invalid OTP. Try '1234' for demo.");
            setLoading(false);
            return;
        }
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1000);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(4);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-soft flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-gradient-brand rounded-2xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                            <PawPrint className="w-8 h-8 text-white" />
                        </div>
                        <span className="font-heading font-bold text-2xl text-gray-900 dark:text-white mt-2">
                            Paws & Care
                        </span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password? 🔑</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Enter your registered email and we'll send you an OTP to reset your password.</p>

                                <form onSubmit={handleSendOTP} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input 
                                                type="email" 
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@gmail.com" 
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white" 
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </Button>

                                    <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-main transition-colors mt-4">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP 💬</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">We've sent a 4-digit code to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.</p>

                                <form onSubmit={handleVerifyOTP} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter 4-Digit Code</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input 
                                                type="text" 
                                                required
                                                maxLength={4}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="0 0 0 0" 
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white tracking-[0.5em] font-black text-center" 
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify Code"}
                                    </Button>

                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-sm font-bold text-gray-500 hover:text-primary-main transition-colors mt-4"
                                    >
                                        Resend OTP
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">New Password 🔒</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Create a strong password to secure your account.</p>

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••" 
                                                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white" 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset! ✨</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Your password has been successfully updated. You can now login with your new credentials.</p>

                                <Link href="/login">
                                    <Button className="w-full h-12 text-base">Back to Login</Button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
