"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawPrint, Briefcase, MapPin, DollarSign } from "lucide-react";
import { signIn } from "next-auth/react";

export default function CaregiverSignup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        type: "Pet Sitter",
        location: "",
        price: "",
        about: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/caregiver/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Auto login after successful signup
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Registration successful, but login failed. Please login manually.");
            } else {
                router.push("/caregiver/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Network error. Please try again.");
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
                    Become a Partner
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already a caregiver?{" "}
                    <Link href="/caregiver/login" className="font-bold text-primary-main hover:text-primary-dark">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                                    <div className="mt-1">
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="Rahul Sharma"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email address</label>
                                    <div className="mt-1">
                                        <input
                                            type="email" required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="rahul@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                                    <div className="mt-1">
                                        <input
                                            type="password" required
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                                    <div className="mt-1">
                                        <input
                                            type="tel" required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400"/> Service Type</label>
                                    <div className="mt-1">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option>Pet Sitter</option>
                                            <option>Boarding Center</option>
                                            <option>Pet Walker</option>
                                            <option>Pet Groomer</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> Service Location</label>
                                    <div className="mt-1">
                                        <input
                                            type="text" required
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="Indore, Madhya Pradesh"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400"/> Pricing (₹ per day/session)</label>
                                    <div className="mt-1">
                                        <input
                                            type="number" required
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">About Your Service</label>
                                    <div className="mt-1">
                                        <textarea
                                            rows={2}
                                            value={formData.about}
                                            onChange={(e) => setFormData({...formData, about: e.target.value})}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
                                            placeholder="I love pets and have 3 years of experience..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-gradient-brand h-[50px] text-lg shadow-lg" disabled={loading}>
                                {loading ? "Registering..." : "Join as Caregiver"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
