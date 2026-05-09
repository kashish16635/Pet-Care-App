"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Star, ShieldCheck, Filter, X, Plus, Minus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const INDIAN_CITIES = [
  "Mumbai, Maharashtra", "Delhi, Delhi", "Bangalore, Karnataka", "Hyderabad, Telangana",
  "Ahmedabad, Gujarat", "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Surat, Gujarat",
  "Pune, Maharashtra", "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh",
  "Nagpur, Maharashtra", "Indore, Madhya Pradesh", "Thane, Maharashtra", "Bhopal, Madhya Pradesh",
  "Visakhapatnam, Andhra Pradesh", "Pimpri-Chinchwad, Maharashtra", "Patna, Bihar", "Vadodara, Gujarat",
  "Ghaziabad, Uttar Pradesh", "Ludhiana, Punjab", "Agra, Uttar Pradesh", "Nashik, Maharashtra",
  "Faridabad, Haryana", "Meerut, Uttar Pradesh", "Rajkot, Gujarat", "Kalyan-Dombivli, Maharashtra",
  "Vasai-Virar, Maharashtra", "Varanasi, Uttar Pradesh", "Srinagar, Jammu and Kashmir", "Aurangabad, Maharashtra",
  "Dhanbad, Jharkhand", "Amritsar, Punjab", "Navi Mumbai, Maharashtra", "Allahabad, Uttar Pradesh",
  "Howrah, West Bengal", "Ranchi, Jharkhand", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh",
  "Coimbatore, Tamil Nadu", "Vijayawada, Andhra Pradesh", "Jodhpur, Rajasthan", "Madurai, Tamil Nadu",
  "Raipur, Chhattisgarh", "Kota, Rajasthan", "Guwahati, Assam", "Chandigarh, Chandigarh",
  "Solapur, Maharashtra", "Hubli-Dharwad, Karnataka", "Bareilly, Uttar Pradesh", "Mysore, Karnataka",
  "Moradabad, Uttar Pradesh", "Gurgaon, Haryana", "Aligarh, Uttar Pradesh", "Jalandhar, Punjab",
  "Tiruchirappalli, Tamil Nadu", "Bhubaneswar, Odisha", "Salem, Tamil Nadu", "Mira-Bhayandar, Maharashtra",
  "Thiruvananthapuram, Kerala", "Bhiwandi, Maharashtra", "Saharanpur, Uttar Pradesh", "Gorakhpur, Uttar Pradesh",
  "Guntur, Andhra Pradesh", "Bikaner, Rajasthan", "Amravati, Maharashtra", "Noida, Uttar Pradesh",
  "Jamshedpur, Jharkhand", "Bhilai, Chhattisgarh", "Cuttack, Odisha", "Firozabad, Uttar Pradesh",
  "Kochi, Kerala", "Nellore, Andhra Pradesh", "Bhavnagar, Gujarat", "Dehradun, Uttarakhand",
  "Durgapur, West Bengal", "Asansol, West Bengal", "Rourkela, Odisha", "Nanded, Maharashtra",
  "Kolhapur, Maharashtra", "Ajmer, Rajasthan", "Akola, Maharashtra", "Gulbarga, Karnataka",
  "Jamnagar, Gujarat", "Ujjain, Madhya Pradesh", "Loni, Uttar Pradesh", "Siliguri, West Bengal",
  "Jhansi, Uttar Pradesh", "Ulhasnagar, Maharashtra", "Jammu, Jammu and Kashmir", "Sangli-Miraj & Kupwad, Maharashtra",
  "Mangalore, Karnataka", "Erode, Tamil Nadu", "Belgaum, Karnataka", "Ambattur, Tamil Nadu",
  "Tirunelveli, Tamil Nadu", "Malegaon, Maharashtra", "Gaya, Bihar", "Jalgaon, Maharashtra",
  "Udaipur, Rajasthan", "Maheshtala, West Bengal"
];

export default function SearchPage() {
    const [serviceType, setServiceType] = useState("all");
    const [locationSearch, setLocationSearch] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [dateError, setDateError] = useState<string | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userCity, setUserCity] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch user profile to get their city
        fetch('/api/user/profile')
            .then(res => {
                if(res.ok) return res.json();
                return null;
            })
            .then(data => {
                if(data && data.city) {
                    setUserCity(data.city);
                }
            })
            .catch(() => {});
    }, []);

    const handleSearch = () => {
        const today = new Date().toISOString().split('T')[0];
        if (searchDate && searchDate < today) {
            setDateError("Invalid date! Please select a current or future date.");
            return;
        }
        setDateError(null);
        setLoading(true);
        fetch(`/api/sitters?type=${serviceType}&location=${locationSearch}`)
            .then(res => res.json())
            .then(data => {
                setProviders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        handleSearch();
    }, [serviceType]);

    // Sort providers so that the ones in the user's city appear at the top
    const sortedProviders = [...providers].sort((a, b) => {
        if (!userCity) return 0;
        // Clean userCity just in case it has full string like "Ujjain, Madhya Pradesh"
        const cleanUserCity = userCity.split(',')[0].trim().toLowerCase();
        const aMatches = a.location.toLowerCase().includes(cleanUserCity);
        const bMatches = b.location.toLowerCase().includes(cleanUserCity);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                {/* --- SEARCH HEADER --- */}
                <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                list="indian-cities"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Mumbai, Maharashtra"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all dark:text-white"
                            />
                            <datalist id="indian-cities">
                                {INDIAN_CITIES.map(city => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="flex-[0.8] w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service</label>
                        <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all dark:text-white"
                        >
                            <option value="all">Any Service</option>
                            <option value="sitter">Pet Sitter</option>
                            <option value="boarding">Boarding Center</option>
                            <option value="walker">Pet Walker</option>
                            <option value="all-in-one">All-in-One Care</option>
                        </select>
                    </div>

                    <div className="flex-[0.8] w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dates</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border ${dateError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all dark:text-white`}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSearch} className="w-full md:w-auto px-8 h-[50px]">
                        <Search className="w-5 h-5 mr-2" /> Search
                    </Button>
                </section>
                
                {dateError && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-3 rounded-2xl mb-8 text-sm font-bold flex items-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5 rotate-180" />
                        {dateError}
                    </motion.div>
                )}

                {/* --- MAIN LAYOUT (LIST + MAP) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1">

                    {/* LEFT: RESULTS LIST */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                                {loading ? "Searching..." : `${providers.length} caregivers found`}
                            </h2>
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                <Filter className="w-4 h-4 mr-2" /> Filters
                            </Button>
                        </div>

                        {!loading && sortedProviders.map((provider, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                key={provider.id}
                                onClick={() => router.push(`/sitter/${provider.id}`)}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 cursor-pointer group"
                            >
                                {/* Profile Placeholder */}
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-light to-secondary-light dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0">
                                    <span className="text-2xl font-bold text-primary-main dark:text-white/50">{provider.name.charAt(0)}</span>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white group-hover:text-primary-main transition-colors">{provider.name}</h3>
                                                {provider.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{provider.type}</p>
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{provider.rating}</span>
                                                <span className="text-gray-400 font-normal">({provider.reviews} reviews)</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{provider.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            {provider.location}
                                        </div>
                                        {/* Link to new Sitter Profile page */}
                                        <Link href={`/sitter/${provider.id}`}>
                                            <Button variant="secondary" size="sm">View Profile</Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT: GOOGLE MAPS REPLICA VIEW */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-24 h-[calc(100vh-120px)] rounded-[2.5rem] overflow-hidden bg-[#e5e3df] dark:bg-gray-950 border border-gray-200 dark:border-gray-800 relative shadow-xl">
                        
                        {/* Map Background Layer (Scalable) */}
                        <motion.div 
                            animate={{ scale: zoomLevel }}
                            transition={{ type: "spring", stiffness: 100, damping: 25 }}
                            className="absolute inset-0 origin-center"
                        >
                            {/* Water Bodies (Blue areas) */}
                            <div className="absolute top-[10%] left-[-10%] w-[60%] h-[40%] bg-[#aad3df] dark:bg-blue-900/30 rounded-[50%_30%_60%_40%] blur-sm" />
                            <div className="absolute top-[60%] right-[-10%] w-[50%] h-[50%] bg-[#aad3df] dark:bg-blue-900/30 rounded-[40%_60%_30%_50%] blur-sm" />
                            <div className="absolute top-[40%] left-[45%] w-[100px] h-[300px] bg-[#aad3df] dark:bg-blue-900/30 -rotate-12 blur-sm" />

                            {/* Land Background with Subtle Grid */}
                            <div className="absolute inset-0 opacity-[0.05]" 
                                 style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                            {/* Street Lines */}
                            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-white dark:bg-gray-800 shadow-sm" />
                            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-white dark:bg-gray-800 shadow-sm" />
                            <div className="absolute left-[30%] top-0 h-full w-[1px] bg-white dark:bg-gray-800 shadow-sm" />
                            <div className="absolute left-[70%] top-0 h-full w-[1px] bg-white dark:bg-gray-800 shadow-sm" />

                            {/* Map Labels (Replica Style) */}
                            <div className="absolute top-[15%] left-[20%] flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mb-1" />
                                <span className="text-[8px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Green Park Reserve</span>
                            </div>
                            <div className="absolute top-[42%] left-[48%] flex flex-col items-center rotate-[-12deg]">
                                <span className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/40 uppercase tracking-widest">Sydney Harbour Bridge</span>
                            </div>
                            <div className="absolute top-[65%] right-[20%] flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mb-1" />
                                <span className="text-[8px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Opera House Plaza</span>
                            </div>
                            <div className="absolute bottom-[15%] left-[30%] flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-orange-400 mb-1" />
                                <span className="text-[8px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Luna Park</span>
                            </div>

                            {/* Sitter Pins - Google Red Teardrop Style */}
                            {providers.map((provider, idx) => {
                                const seed = provider.id.charCodeAt(0) + provider.id.charCodeAt(provider.id.length-1);
                                const top = 20 + (seed % 60); 
                                const left = 20 + ((seed * 7) % 60); 

                                return (
                                    <motion.div
                                        key={provider.id}
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{ top: `${top}%`, left: `${left}%` }}
                                        className="absolute cursor-pointer group"
                                        onClick={() => setSelectedProvider(provider)}
                                    >
                                        <div className="relative flex flex-col items-center">
                                            {/* Classic Google Red Pin SVG */}
                                            <svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-md transition-transform group-hover:scale-110 ${selectedProvider?.id === provider.id ? 'scale-125' : ''}`}>
                                                <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill={selectedProvider?.id === provider.id ? "#ea4335" : "#ea4335"} />
                                                <circle cx="12" cy="12" r="3" fill="white" />
                                            </svg>
                                            
                                            {/* Price Label (Floating above pin) */}
                                            <div className="absolute -top-6 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-gray-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap">₹{provider.price}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Map UI Elements (Replica) */}
                        <div className="absolute top-4 left-4 flex shadow-sm rounded border border-gray-300 dark:border-gray-700 overflow-hidden z-50">
                            <button className="bg-white dark:bg-gray-900 px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 transition-colors">Map</button>
                            <button className="bg-white/80 dark:bg-gray-900/80 px-3 py-1.5 text-[11px] font-bold text-gray-400 dark:text-gray-600 hover:bg-gray-50 transition-colors">Satellite</button>
                        </div>

                        <button className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-900 rounded shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center z-50">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        </button>

                        {/* Zoom & Pegman Panel */}
                        <div className="absolute bottom-10 right-4 flex flex-col gap-0 shadow-md rounded border border-gray-300 dark:border-gray-700 overflow-hidden z-50 bg-white dark:bg-gray-900">
                            {/* Pegman */}
                            <div className="w-10 h-10 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 cursor-pointer group">
                                <div className="w-4 h-8 bg-[#f4bc42] rounded-full group-hover:scale-110 transition-transform" />
                            </div>
                            <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))} className="w-10 h-10 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 text-xl text-gray-600">+</button>
                            <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-xl text-gray-600">-</button>
                        </div>

                        {/* Detail Popover (Same logic) */}
                        <AnimatePresence>
                            {selectedProvider && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="absolute bottom-6 left-6 right-16 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 flex gap-4"
                                >
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl font-bold text-primary-main">
                                        {selectedProvider.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{selectedProvider.name}</h4>
                                        <p className="text-xs text-gray-500 mb-2">{selectedProvider.location}</p>
                                        <Button size="sm" className="h-8 text-[10px] w-full" onClick={() => router.push(`/sitter/${selectedProvider.id}`)}>Book Now - ₹{selectedProvider.price}</Button>
                                    </div>
                                    <button onClick={() => setSelectedProvider(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>



                </div>
            </main>

            <Footer />
        </div>
    );
}
