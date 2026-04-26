"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawPrint, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Immediately redirect to login
            router.push("/login?registered=true");
        } catch (err) {
            setError("Failed to register. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-soft flex items-center justify-center p-4 py-12">
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
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Create Account ✨</h1>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Join the community of happy pet parents.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder="Aditi Sharma" 
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white" 
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="password" 
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main outline-none transition-all dark:text-white" 
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base mt-6" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-primary-main hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
