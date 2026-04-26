"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Bell, CheckCircle2, CalendarHeart, MessageCircle, Info, Loader2 } from "lucide-react";

export default function NotificationsPage() {
    const { status } = useSession();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/notifications")
                .then(res => res.json())
                .then(data => {
                    setNotifications(data);
                    setLoading(false);
                });
        }
    }, [status]);

    const handleMarkAllRead = async () => {
        const res = await fetch("/api/notifications", { method: "PUT" });
        if (res.ok) {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        }
    };

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-main w-10 h-10"/></div>;
    }

    if (status === "unauthenticated") {
        return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Log in to view notifications</div>;
    }

    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-24 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <button onClick={handleMarkAllRead} className="text-sm font-medium text-primary-main hover:underline">Mark all as read</button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.length === 0 && <p className="p-6 text-gray-500">No notifications.</p>}
                    
                    {notifications.map((n: any) => (
                        <div key={n.id} className={`p-4 sm:p-6 flex gap-4 items-start relative ${!n.read ? 'bg-primary-light/5 dark:bg-primary-main/5' : ''}`}>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary-main absolute top-8 left-2" />}
                            
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                {n.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white mb-1">{n.type === 'success' ? 'Success!' : 'Notice'}</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{n.message}</p>
                                <span className="text-xs font-semibold text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
