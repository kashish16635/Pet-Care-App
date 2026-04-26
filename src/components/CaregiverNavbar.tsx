"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, PawPrint, LogOut, Sun, Moon, Bell, Briefcase, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "./ui/Button";
import { usePathname } from "next/navigation";

export function CaregiverNavbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { data: session } = useSession();
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const notificationsRef = React.useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
        if (session) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    };

    // Listen for custom event to open drawer from other components
    React.useEffect(() => {
        const handleOpenDrawer = () => setIsDrawerOpen(true);
        window.addEventListener('open-notifications-drawer', handleOpenDrawer);
        return () => window.removeEventListener('open-notifications-drawer', handleOpenDrawer);
    }, []);

    const markAsRead = async () => {
        try {
            await fetch("/api/notifications", { method: "PUT" });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        if (isNotificationsOpen || isDrawerOpen) {
            markAsRead();
            fetchNotifications(); // Refresh when opening
        }
    }, [isNotificationsOpen, isDrawerOpen]);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitials = session?.user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || "P";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/caregiver/dashboard" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-white/20 transition-colors">
                            <PawPrint className="w-5 h-5 text-gray-900 dark:text-white" />
                        </div>
                        <span className="font-heading font-bold text-lg text-gray-900 dark:text-white tracking-wide">
                            Paws & Care <span className="text-primary-main ml-1">Partner</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6 text-sm font-medium items-center">
                            <Link href="/caregiver/dashboard" className={`transition-colors ${pathname === '/caregiver/dashboard' ? 'text-primary-main font-bold' : 'text-gray-600 dark:text-slate-300 hover:text-primary-main dark:hover:text-white'}`}>Dashboard</Link>
                            <Link href="/caregiver/bookings" className={`transition-colors ${pathname === '/caregiver/bookings' ? 'text-primary-main font-bold' : 'text-gray-600 dark:text-slate-300 hover:text-primary-main dark:hover:text-white'}`}>Bookings</Link>
                            <Link href="/caregiver/earnings" className={`transition-colors ${pathname === '/caregiver/earnings' ? 'text-primary-main font-bold' : 'text-gray-600 dark:text-slate-300 hover:text-primary-main dark:hover:text-white'}`}>Earnings</Link>
                            <Link href="/caregiver/messages" className={`transition-colors ${pathname === '/caregiver/messages' ? 'text-primary-main font-bold' : 'text-gray-600 dark:text-slate-300 hover:text-primary-main dark:hover:text-white'}`}>Messages</Link>
                            <Link href="/caregiver/profile" className={`transition-colors ${pathname === '/caregiver/profile' ? 'text-primary-main font-bold' : 'text-gray-600 dark:text-slate-300 hover:text-primary-main dark:hover:text-white'}`}>Profile</Link>
                        </div>
                        
                        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                            {/* Utility Icons */}
                            <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-slate-600">
                                <div className="relative" ref={notificationsRef}>
                                    <button 
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className={`p-1.5 text-gray-500 dark:text-slate-400 hover:text-primary-main dark:hover:text-white rounded-full transition-colors relative ${isNotificationsOpen ? 'text-primary-main' : ''}`}
                                    >
                                        <Bell className="w-[18px] h-[18px]" />
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-dropdown border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">Notifications</h3>
                                                    <span 
                                                        onClick={markAsRead}
                                                        className="text-[10px] font-bold text-primary-main uppercase tracking-widest cursor-pointer hover:underline"
                                                    >
                                                        Mark all read
                                                    </span>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                                                    {notifications.length > 0 ? (
                                                        notifications.slice(0, 5).map((n) => (
                                                            <div key={n.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-3 ${!n.read ? 'bg-primary-light/5' : ''}`}>
                                                                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${n.type === 'Success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                    {n.type === 'Success' ? <PawPrint className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{n.title}</p>
                                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{n.message}</p>
                                                                    <p className="text-[9px] text-gray-400 mt-1 font-medium">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center">
                                                            <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">No notifications</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setIsNotificationsOpen(false);
                                                        setIsDrawerOpen(true);
                                                    }}
                                                    className="w-full py-3 text-center text-[10px] font-black text-primary-main uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-50 dark:border-gray-800 transition-colors"
                                                >
                                                    View All
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <button 
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-primary-main dark:hover:text-white rounded-full transition-colors"
                                >
                                    {mounted && theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                                </button>
                            </div>

                            {/* User Trigger */}
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 pl-3 hover:bg-gray-50 dark:hover:bg-white/5 py-1.5 px-2 rounded-lg transition-all"
                            >
                                <div className="flex flex-col items-end text-right">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                                        {session?.user?.name || "Partner"}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-primary-main flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden border border-white/20">
                                    <span className="translate-y-[0.5px]">{userInitials}</span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-dropdown border border-gray-100 dark:border-gray-800 py-1.5 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {session?.user?.name || "Partner"}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                                {session?.user?.email}
                                            </p>
                                        </div>

                                        <div className="px-1.5">
                                            <button 
                                                onClick={() => signOut({ callbackUrl: '/caregiver/login' })}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-4 px-4 flex flex-col gap-1 overflow-hidden"
                    >
                        <Link onClick={() => setIsOpen(false)} href="/caregiver/dashboard" className={`px-4 py-3 rounded-lg font-bold text-sm ${pathname === '/caregiver/dashboard' ? 'bg-primary-light/10 text-primary-main' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white'}`}>Dashboard</Link>
                        <Link onClick={() => setIsOpen(false)} href="/caregiver/bookings" className={`px-4 py-3 rounded-lg font-bold text-sm ${pathname === '/caregiver/bookings' ? 'bg-primary-light/10 text-primary-main' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-300'}`}>Bookings</Link>
                        <Link onClick={() => setIsOpen(false)} href="/caregiver/earnings" className={`px-4 py-3 rounded-lg font-bold text-sm ${pathname === '/caregiver/earnings' ? 'bg-primary-light/10 text-primary-main' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-300'}`}>Earnings</Link>
                        <Link onClick={() => setIsOpen(false)} href="/caregiver/messages" className={`px-4 py-3 rounded-lg font-bold text-sm ${pathname === '/caregiver/messages' ? 'bg-primary-light/10 text-primary-main' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-300'}`}>Messages</Link>
                        <Link onClick={() => setIsOpen(false)} href="/caregiver/profile" className={`px-4 py-3 rounded-lg font-bold text-sm ${pathname === '/caregiver/profile' ? 'bg-primary-light/10 text-primary-main' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-300'}`}>Profile</Link>
                        
                        <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />
                        
                        <div className="flex flex-col gap-2 px-2">
                            <Button variant="outline" className="w-full font-bold bg-transparent border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => signOut({ callbackUrl: '/caregiver/login' })}>Sign Out</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification Drawer Overlay */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Partner Notifications</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Manage your service alerts</p>
                                </div>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-gray-950">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-gray-50 dark:divide-gray-900">
                                        {notifications.map((n: any, index: number) => (
                                            <div 
                                                key={n?.id || `cnotif-${index}`} 
                                                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all flex gap-4 ${!n?.read ? 'bg-primary-light/5 border-l-4 border-primary-main' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${n?.type === 'Success' || n?.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {n?.type === 'Success' || n?.type === 'success' ? <PawPrint className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{n?.title || n?.type || "Update"}</h4>
                                                        <span className="text-[9px] font-bold text-gray-400">{n?.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}</span>
                                                    </div>
                                                    <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">{n?.message || "No details available"}</p>
                                                    {!n.read && (
                                                        <button className="mt-3 text-[9px] font-black text-primary-main uppercase tracking-widest hover:underline">Mark read</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                                            <Bell className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No new updates</h3>
                                        <p className="text-xs text-gray-500 max-w-[180px]">We'll notify you here when you have new booking requests or updates.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <Button className="w-full py-5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-main/10" onClick={() => setIsDrawerOpen(false)}>Close Notifications</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
