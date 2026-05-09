"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { MapPin, ArrowLeft, Camera, Navigation, CheckCircle2, Bone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackingPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const router = useRouter();
    
    const [selectedStory, setSelectedStory] = useState<string | null>(null);

    const initialStories = [
        { id: 1, type: 'video', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=600', time: '10 mins ago', title: 'Start of Walk' },
        { id: 2, type: 'photo', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=600', time: '5 mins ago', title: 'Playing at the park' },
        { id: 3, type: 'photo', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400&h=600', time: 'Just now', title: 'Drink break!' }
    ];

    const [storyList, setStoryList] = useState(initialStories);
    const [distance, setDistance] = useState(1.2);
    const [statusText, setStatusText] = useState("Walking to Park");

    // 1. Map Simulation Logic: Distance aur Status update karne ke liye
    useEffect(() => {
        const interval = setInterval(() => {
            setDistance(prev => {
                const next = prev + 0.1; // Har 5 second mein 0.1 km badhayein
                if (next > 1.5 && next < 2.5) setStatusText("Playing at Park");
                else if (next >= 2.5) setStatusText("Returning Home");
                return Number(next.toFixed(1));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 2. Photo Upload Logic: Caregiver jab photo select karega
    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Nayi photo ko list ke top par add karna
                setStoryList(prev => [
                    ...prev, 
                    { id: Date.now(), type: 'photo', url: reader.result as string, time: 'Just now', title: 'New Update' }
                ]);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Live Tracking</h1>
                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
                        </p>
                    </div>
                </div>

                {/* Tracking Map Simulation */}
                <div className="bg-white dark:bg-gray-900 p-2 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden h-[400px]">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 bg-[#e5e3df] dark:bg-gray-950 overflow-hidden rounded-[2.2rem]">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                        
                        {/* Street lines */}
                        <div className="absolute top-[40%] left-0 w-full h-[10px] bg-white dark:bg-gray-800" />
                        <div className="absolute left-[30%] top-0 h-full w-[10px] bg-white dark:bg-gray-800" />
                        
                        {/* Green Area (Park) */}
                        <div className="absolute top-10 right-10 w-48 h-48 bg-green-200 dark:bg-green-900/30 rounded-3xl blur-sm" />

                        {/* Route Path (SVG) */}
                        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}>
                            <path d="M 100 200 C 150 200, 250 150, 300 100 S 500 150, 600 250" fill="transparent" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" strokeDasharray="10, 15" className="animate-[dash_1s_linear_infinite]" />
                        </svg>

                        {/* Moving Marker */}
                        <motion.div 
                            className="absolute z-10"
                            animate={{ 
                                x: [100, 300, 600, 600],
                                y: [200, 100, 250, 250]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="relative -ml-6 -mt-12 flex flex-col items-center">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 flex items-center justify-center shadow-xl">
                                    <span className="text-xl">🐶</span>
                                </div>
                                <div className="w-4 h-4 bg-indigo-500 rotate-45 -mt-2 shadow-sm" />
                            </div>
                        </motion.div>
                        
                        {/* Caregiver Dot */}
                        <motion.div 
                            className="absolute z-10"
                            animate={{ 
                                x: [90, 290, 590, 590],
                                y: [210, 110, 260, 260]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-4 h-4 bg-secondary-main rounded-full border-2 border-white shadow-lg" />
                        </motion.div>
                    </div>

                    {/* Overlay Status */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-5 rounded-3xl shadow-xl flex items-center justify-between border border-white/20 dark:border-gray-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white uppercase">{statusText}</p>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Distance</p>
                            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase">{distance} km</p>
                        </div>
                    </div>
                </div>

                {/* Stories & Updates Section */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Today's Updates</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Photos & Videos from caregiver</p>
                        </div>
                        <label className="p-3 bg-secondary-main/10 rounded-full text-secondary-main cursor-pointer hover:bg-secondary-main/20 transition-colors">
                            <Camera className="w-6 h-6" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
                        </label>
                    </div>

                    {/* Horizontal Stories List */}
                    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                        {storyList.map(story => (
                            <div key={story.id} onClick={() => setSelectedStory(story.url)} className="flex flex-col gap-2 shrink-0 cursor-pointer group">
                                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary-main to-secondary-main group-hover:scale-105 transition-transform">
                                    <div className="w-full h-full rounded-full border-4 border-white dark:border-gray-900 overflow-hidden relative">
                                        <img src={story.url} alt={story.title} className="w-full h-full object-cover" />
                                        {story.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center pl-0.5">
                                                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-black border-b-4 border-b-transparent" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider w-24 truncate">{story.title}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{story.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* Story Viewer Modal */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <button onClick={() => setSelectedStory(null)} className="absolute top-8 right-8 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md aspect-[9/16] bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 right-0 p-4 flex gap-1 z-10">
                                <div className="h-1 bg-white flex-1 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5 }} className="h-full bg-white/50" onAnimationComplete={() => setSelectedStory(null)} />
                                </div>
                            </div>
                            <img src={selectedStory} alt="Story Viewer" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-20 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-main flex items-center justify-center">
                                        <Bone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Happy Pet Walker</p>
                                        <p className="text-xs text-white/70">Just uploaded</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
