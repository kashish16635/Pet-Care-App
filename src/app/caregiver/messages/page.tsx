"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CaregiverNavbar } from "@/components/CaregiverNavbar";
import { Footer } from "@/components/Footer";
import { MessageSquare, User, Search, RefreshCw } from "lucide-react";

export default function CaregiverInboxPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inbox, setInbox] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInbox = async () => {
        try {
            const res = await fetch("/api/caregiver/messages");
            if (res.ok) {
                const data = await res.json();
                setInbox(data);
            }
        } catch (error) {
            console.error("Failed to fetch inbox:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/caregiver/login");
        } else if (status === "authenticated") {
            fetchInbox();
        }
    }, [status]);

    if (status === "loading") return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <CaregiverNavbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">Messages</h1>
                    <p className="text-gray-500 dark:text-gray-400">Connect with pet owners and manage your conversations.</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-main dark:text-white"
                            />
                        </div>
                        <button 
                            onClick={fetchInbox}
                            className="p-2.5 text-gray-400 hover:text-primary-main bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-main' : ''}`} />
                        </button>
                    </div>

                    {/* Inbox List */}
                    <div className="flex flex-col min-h-[400px]">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20">
                                <RefreshCw className="w-8 h-8 animate-spin text-primary-main mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Inbox...</p>
                            </div>
                        ) : inbox.length > 0 ? (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {inbox.map((conv, idx) => (
                                    <Link 
                                        href={`/messages/${conv.otherUser.id}`} 
                                        key={idx}
                                        className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-light/30 to-secondary-light/30 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0 border border-white/50 dark:border-gray-600 shadow-sm">
                                            <span className="text-lg font-bold text-primary-main uppercase">{conv.otherUser.name?.charAt(0) || "U"}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{conv.otherUser.name || "Pet Owner"}</h3>
                                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                                    {new Date(conv.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-snug">
                                                {conv.latestMessage}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                                    <MessageSquare className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No messages yet</h3>
                                <p className="text-sm text-gray-500 max-w-xs">When pet owners reach out to you, their messages will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
