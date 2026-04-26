"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";
import { Menu, X, PawPrint, Moon, Settings, ChevronDown, User, LifeBuoy, LogOut, Sun, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { data: session } = useSession();
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const notificationsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
        if (session) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            console.log("DEBUG: Notifications Data:", data);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("DEBUG: Fetch Error:", error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch("/api/notifications", { method: "PUT" });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteAllRead = async () => {
        try {
            await fetch("/api/notifications", { method: "DELETE" });
            setNotifications(prev => prev.filter(n => !n.read));
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

    // Listen for custom event to open drawer from other components
    React.useEffect(() => {
        const handleOpenDrawer = () => setIsDrawerOpen(true);
        window.addEventListener('open-notifications-drawer', handleOpenDrawer);
        return () => window.removeEventListener('open-notifications-drawer', handleOpenDrawer);
    }, []);

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
        .toUpperCase() || "U";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-brand rounded-xl group-hover:scale-105 transition-transform">
                            <PawPrint className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-heading font-bold text-2xl text-gradient">
                            Paws & Care
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
                            <Link href="/dashboard" className="hover:text-primary-main transition-colors text-[13px] tracking-tight">Dashboard</Link>
                            <Link href="/profile" className="hover:text-primary-main transition-colors text-[13px] tracking-tight">Profile</Link>
                            <Link href="/wallet" className="hover:text-primary-main transition-colors text-[13px] tracking-tight">Wallet</Link>
                            <Link href="/search" className="hover:text-primary-main transition-colors text-[13px] tracking-tight">Book Service</Link>
                            
                            {/* Role-based action button */}
                            {session?.user?.role === "CAREGIVER" && (
                                <Link href="/caregiver/dashboard">
                                    <span className="bg-slate-800 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer ml-2">
                                        Partner Portal
                                    </span>
                                </Link>
                            )}
                            {!session && (
                                <Link href="/caregiver/signup" className="text-primary-main font-bold hover:text-primary-dark transition-colors text-[13px] tracking-tight ml-2">
                                    Become a Caregiver
                                </Link>
                            )}
                        </div>
                        
                        {session ? (
                            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                                {/* Utility Icons */}
                                <div className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-gray-800">
                                    <button 
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="p-2 text-gray-400 hover:text-primary-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                                    >
                                        {mounted && theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                                    </button>
                                    
                                    {/* Notifications Dropdown */}
                                    <div className="relative" ref={notificationsRef}>
                                        <button 
                                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                            className={`p-2 text-gray-400 hover:text-primary-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all relative ${isNotificationsOpen ? 'text-primary-main bg-gray-100 dark:bg-gray-800' : ''}`}
                                        >
                                            <Bell className="w-[18px] h-[18px]" />
                                            {notifications.some(n => !n.read) && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {isNotificationsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-dropdown border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                                        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">Notifications</h3>
                                                        <span 
                                                            onClick={markAsRead}
                                                            className="text-[10px] font-bold text-primary-main uppercase tracking-widest cursor-pointer hover:underline"
                                                        >
                                                            Mark all read
                                                        </span>
                                                    </div>
                                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                                                        {notifications.length > 0 ? (
                                                            notifications.map((n) => (
                                                                <div key={n.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-3 group relative ${!n.read ? 'bg-primary-light/5' : ''}`}>
                                                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${n.type === 'Success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                        {n.type === 'Success' ? <PawPrint className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{n.title}</p>
                                                                            <button 
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    deleteNotification(n.id);
                                                                                }}
                                                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-md transition-all"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{n.message}</p>
                                                                        <p className="text-[9px] text-gray-400 mt-1 font-medium">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-8 text-center">
                                                                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">No new alerts</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            setIsNotificationsOpen(false);
                                                            setIsDrawerOpen(true);
                                                        }}
                                                        className="w-full py-3 text-center text-[11px] font-black text-primary-main uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-50 dark:border-gray-800 transition-colors"
                                                    >
                                                        View All Notifications
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <Link href="/settings" className="p-2 text-gray-400 hover:text-primary-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                                        <Settings className="w-[18px] h-[18px]" />
                                    </Link>
                                </div>

                                {/* User Trigger */}
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2.5 pl-2 hover:bg-gray-50 dark:hover:bg-gray-800 py-1.5 px-2 rounded-xl transition-all"
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden ring-2 ring-white dark:ring-gray-900 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="translate-y-[0.5px]">{userInitials}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-[13px] font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                                            {session.user?.name || "User"}
                                        </span>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">
                                            Owner
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                            className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-dropdown border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden"
                                        >
                                            {/* Dropdown Header */}
                                            <div className="px-4 py-4 border-b border-gray-50 dark:border-gray-800 mb-2">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                                    {session.user?.name || "User"}
                                                </p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate font-medium">
                                                    {session.user?.email || "user@example.com"}
                                                </p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="px-2 space-y-0.5">
                                                <Link 
                                                    href="/profile" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-main rounded-xl transition-all group"
                                                >
                                                    <User className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary-main transition-colors" />
                                                    Profile
                                                </Link>
                                                <Link 
                                                    href="/settings" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-main rounded-xl transition-all group"
                                                >
                                                    <Settings className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary-main transition-colors" />
                                                    Settings
                                                </Link>
                                                <button 
                                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-main rounded-xl transition-all group"
                                                >
                                                    {mounted && theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary-main transition-colors" /> : <Moon className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary-main transition-colors" />}
                                                    {mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-main rounded-xl transition-all group">
                                                    <LifeBuoy className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary-main transition-colors" />
                                                    Help Center
                                                </button>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-800 px-2">
                                                <button 
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                                                >
                                                    <LogOut className="w-4.5 h-4.5" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4" suppressHydrationWarning>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="font-bold text-[13px]" suppressHydrationWarning>Log in</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm" className="bg-gradient-brand font-bold text-[13px] px-6" suppressHydrationWarning>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary-main focus:outline-none p-2"
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
                        className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 shadow-xl dark:border-gray-800 py-4 px-4 flex flex-col gap-1 overflow-hidden"
                    >
                        <Link onClick={() => setIsOpen(false)} href="/dashboard" className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-200">Dashboard</Link>
                        <Link onClick={() => setIsOpen(false)} href="/profile" className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-200">Profile</Link>
                        <Link onClick={() => setIsOpen(false)} href="/wallet" className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-200">Wallet</Link>

                        <Link onClick={() => setIsOpen(false)} href="/search" className="px-4 py-3 bg-primary-light/10 text-primary-main dark:bg-primary-main/10 rounded-xl font-bold text-sm mb-2">Book Service</Link>
                        
                        {session?.user?.role === "CAREGIVER" && (
                            <Link onClick={() => setIsOpen(false)} href="/caregiver/dashboard" className="px-4 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm mb-2">Go to Partner Portal</Link>
                        )}
                        {!session && (
                            <Link onClick={() => setIsOpen(false)} href="/caregiver/signup" className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm text-primary-main">Become a Caregiver</Link>
                        )}
                        <Link onClick={() => setIsOpen(false)} href="/settings" className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-200">Settings</Link>
                        
                        <div className="h-px bg-gray-50 dark:bg-gray-800 my-2" />
                        
                        <div className="flex flex-col gap-2 px-2">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 px-2 py-3 mb-1">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            {userInitials}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{session.user?.name}</span>
                                            <span className="text-xs text-gray-400 leading-none">Owner</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full font-bold border-red-500/20 text-red-500" onClick={() => signOut()}>Sign Out</Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full">
                                        <Button variant="outline" className="w-full font-bold">Log in</Button>
                                    </Link>
                                    <Link href="/signup" className="w-full">
                                        <Button className="w-full bg-gradient-brand font-bold text-white">Sign Up</Button>
                                    </Link>
                                </>
                            )}
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
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Notifications</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Stay updated with your pet care</p>
                                </div>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-[400px] bg-white dark:bg-gray-950">
                                {notifications && notifications.length > 0 ? (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {notifications.map((n: any, index: number) => (
                                            <div 
                                                key={n?.id || `unotif-${index}`} 
                                                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all flex gap-4 group ${!n?.read ? 'bg-primary-light/5 border-l-4 border-primary-main' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${n?.type === 'Success' || n?.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {n?.type === 'Success' || n?.type === 'success' ? <PawPrint className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{n?.title || n?.type || "Update"}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] font-bold text-gray-400">{n?.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}</span>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteNotification(n.id);
                                                                }}
                                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">{n?.message || "No details available"}</p>
                                                    {!n.read && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead();
                                                            }}
                                                            className="mt-3 text-[9px] font-black text-primary-main uppercase tracking-widest hover:underline"
                                                        >
                                                            Mark read
                                                        </button>
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
                                        <p className="text-xs text-gray-500 max-w-[180px] mb-6">We'll notify you here when you have new requests.</p>
                                        <Button variant="outline" size="sm" onClick={() => fetchNotifications()}>Reload List</Button>
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
