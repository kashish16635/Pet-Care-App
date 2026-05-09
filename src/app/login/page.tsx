"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawPrint, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
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

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h1>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to manage your pets and bookings.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    placeholder="you@example.com" 
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white" 
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-sm font-medium text-primary-main hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    required
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

                        <Button type="submit" className="w-full h-12 text-base mt-4" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-bold text-primary-main hover:underline">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
