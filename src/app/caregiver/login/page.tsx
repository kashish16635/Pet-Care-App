"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawPrint } from "lucide-react";

export default function CaregiverLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push("/caregiver/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-gradient-brand rounded-2xl shadow-lg">
                        <PawPrint className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
                    Caregiver Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Manage your bookings and profile
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email" required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password" required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full bg-gradient-brand h-[50px] text-lg shadow-lg" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in to Dashboard"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Not a partner yet?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/caregiver/signup">
                                <Button variant="outline" className="w-full font-bold h-[50px]">Apply as Caregiver</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
