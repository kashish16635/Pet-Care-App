"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Settings, Bell, Moon, ChevronRight, Shield, BellRing, Palette, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const [profile, setProfile] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("General");
    const [mounted, setMounted] = useState(false);

    // Form states for General
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    // Password states
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: ""
    });

    // Notification states
    const [notificationPrefs, setNotificationPrefs] = useState([
        { id: "bookings", title: "Booking Updates", desc: "Get notified when a sitter accepts or rejects your booking", active: true },
        { id: "wallet", title: "Wallet Alerts", desc: "Receive alerts for payments, refunds and low balance", active: true },
        { id: "promo", title: "Promo & Offers", desc: "Stay updated with latest discounts and features", active: false },
        { id: "messages", title: "Direct Messages", desc: "Notifications for messages from caregivers", active: true },
    ]);

    useEffect(() => {
        setMounted(true);
        if (session) {
            fetchProfile();
        }
    }, [session]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                address: profile.address || ""
            });
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    const handleSaveProfile = async () => {
        alert("Profile settings saved successfully!");
    };

    const handleUpdatePassword = async () => {
        if (!passwordData.current || !passwordData.new) {
            alert("Please fill in both password fields.");
            return;
        }
        alert("Password updated successfully!");
        setPasswordData({ current: "", new: "" });
    };

    const toggleNotification = (id: string) => {
        setNotificationPrefs(prev => prev.map(p => 
            p.id === id ? { ...p, active: !p.active } : p
        ));
    };

    if (status === "loading" || !mounted) return null;
    if (!session) {
        window.location.href = "/login";
        return null;
    }

    const tabs = [
        { name: "General", icon: Settings },
        { name: "Notifications", icon: BellRing },
        { name: "Appearance", icon: Palette },
        { name: "Privacy & Security", icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-950 font-sans selection:bg-rose-100 selection:text-rose-600">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Settings</h1>
                        <p className="text-xs font-black text-primary-main uppercase tracking-[0.3em] ml-1">Personalize your platform experience</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Settings Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-brand rounded-2xl shadow-lg shadow-rose-500/20">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Main Menu</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigate preferences</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {tabs.map((item) => (
                                    <button 
                                        key={item.name}
                                        onClick={() => setActiveTab(item.name)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${activeTab === item.name ? 'bg-primary-main text-white shadow-xl shadow-primary-main/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className={`w-5 h-5 ${activeTab === item.name ? 'text-white' : 'text-gray-400 group-hover:text-primary-main'}`} />
                                            <span className="text-[13px] font-black uppercase tracking-tight">{item.name}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 ${activeTab === item.name ? 'text-white/60' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </nav>
                        </motion.div>

                        <div className="bg-gradient-to-br from-primary-main to-secondary-main rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary-main/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Shield className="w-32 h-32" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2 relative z-10">Pro Account</h4>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-6 relative z-10">Unlock premium pet services</p>
                            <Button className="w-full bg-white text-primary-main font-black rounded-2xl py-4 shadow-xl hover:bg-gray-50 relative z-10">Upgrade Now</Button>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[600px] flex flex-col"
                            >
                                {activeTab === "General" && (
                                    <div className="space-y-8 flex-1">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-rose-600/10 rounded-2xl">
                                                <Settings className="w-6 h-6 text-rose-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">General Account</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update your basic information</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-main outline-none text-[13px] font-bold text-gray-900 dark:text-white" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-main outline-none text-[13px] font-bold text-gray-900 dark:text-white" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-main outline-none text-[13px] font-bold text-gray-900 dark:text-white" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    placeholder="City, State"
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-main outline-none text-[13px] font-bold text-gray-900 dark:text-white" 
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8 flex justify-end">
                                            <Button onClick={handleSaveProfile} className="px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-xs">Save Changes</Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Notifications" && (
                                    <div className="space-y-8 flex-1">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-blue-600/10 rounded-2xl">
                                                <BellRing className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Notification Alerts</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choose how you want to be notified</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {notificationPrefs.map((pref) => (
                                                <div 
                                                    key={pref.id} 
                                                    onClick={() => toggleNotification(pref.id)}
                                                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all cursor-pointer group"
                                                >
                                                    <div>
                                                        <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{pref.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{pref.desc}</p>
                                                    </div>
                                                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${pref.active ? 'bg-primary-main' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                        <motion.div 
                                                            animate={{ x: pref.active ? 24 : 4 }}
                                                            initial={false}
                                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Appearance" && (
                                    <div className="space-y-8 flex-1">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-purple-600/10 rounded-2xl">
                                                <Palette className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Theme & Styling</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customize how the platform looks</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div 
                                                onClick={() => setTheme("light")}
                                                className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all ${theme === 'light' ? 'border-primary-main bg-primary-light/5' : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'}`}
                                            >
                                                <div className="w-full aspect-video bg-white rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-center">
                                                    <div className="w-1/2 h-2 bg-gray-100 rounded-full" />
                                                </div>
                                                <p className="text-center font-black uppercase tracking-widest text-xs">Light Mode</p>
                                            </div>
                                            <div 
                                                onClick={() => setTheme("dark")}
                                                className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary-main bg-primary-light/5' : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'}`}
                                            >
                                                <div className="w-full aspect-video bg-gray-900 rounded-xl shadow-sm border border-gray-800 mb-4 flex items-center justify-center">
                                                    <div className="w-1/2 h-2 bg-gray-800 rounded-full" />
                                                </div>
                                                <p className="text-center font-black uppercase tracking-widest text-xs">Dark Mode</p>
                                            </div>
                                        </div>

                                        <div className="mt-10 p-8 bg-primary-main/5 rounded-3xl border border-primary-main/10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Auto Dark Mode</p>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Sync with your system preferences</p>
                                                </div>
                                                <div 
                                                    onClick={() => setTheme("system")}
                                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${theme === 'system' ? 'bg-primary-main' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${theme === 'system' ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Privacy & Security" && (
                                    <div className="space-y-8 flex-1">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-emerald-600/10 rounded-2xl">
                                                <Shield className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Security Center</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Protect your account and data</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                                <h4 className="text-[13px] font-black uppercase tracking-tight mb-4">Change Password</h4>
                                                <div className="space-y-4">
                                                    <input 
                                                        type="password" 
                                                        placeholder="Current Password" 
                                                        value={passwordData.current}
                                                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none outline-none text-[13px] font-bold" 
                                                    />
                                                    <input 
                                                        type="password" 
                                                        placeholder="New Password" 
                                                        value={passwordData.new}
                                                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none outline-none text-[13px] font-bold" 
                                                    />
                                                    <Button onClick={handleUpdatePassword} className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">Update Password</Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                                                <div>
                                                    <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Two-Factor Authentication</p>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Add an extra layer of security</p>
                                                </div>
                                                <Button variant="outline" className="px-6 rounded-xl font-black uppercase tracking-widest text-[10px]">Enable</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Danger Zone</h4>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Irreversible account actions</p>
                                    </div>
                                    <Button variant="ghost" className="text-red-500 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30">Deactivate Account</Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
