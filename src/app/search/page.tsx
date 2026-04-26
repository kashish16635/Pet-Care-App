"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Star, ShieldCheck, Filter, Plus, Minus } from "lucide-react";

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
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userCity, setUserCity] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState("");
    const [mapZoom, setMapZoom] = useState(1);
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
        if (searchDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selected = new Date(searchDate);
            if (selected < today) {
                alert("Please select a current or future date. Past dates are not valid for bookings.");
                return;
            }
        }

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
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSearch} className="w-full md:w-auto px-8 h-[50px]">
                        <Search className="w-5 h-5 mr-2" /> Search
                    </Button>
                </section>

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

                    {/* RIGHT: INTERACTIVE MAP VIEW */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-24 h-[calc(100vh-120px)] rounded-[32px] overflow-hidden bg-[#e5e7eb] dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 shadow-inner group">
                        
                        {/* Zoomable Container */}
                        <motion.div 
                            animate={{ scale: mapZoom }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="absolute inset-0 origin-center"
                        >
                            {/* Realistic Map Texture/Pattern */}
                            <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none" 
                                style={{ 
                                    backgroundImage: `radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 0)`,
                                    backgroundSize: '32px 32px' 
                                }} 
                            />
                            
                            {/* Decorative Map Elements (Rivers/Roads Mockup) */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none" viewBox="0 0 800 600">
                                <path d="M-50 200 Q 200 150 400 300 T 850 250" fill="none" stroke="currentColor" strokeWidth="20" className="text-blue-400 dark:text-blue-900" />
                                <path d="M300 -50 Q 350 200 250 400 T 400 650" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-300 dark:text-gray-800" />
                                <path d="M0 450 Q 300 400 800 500" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-300 dark:text-gray-800" />
                            </svg>

                            {/* Dynamic Map Pins */}
                            <AnimatePresence>
                                {/* User's Search Location Pin */}
                                {locationSearch && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1 / mapZoom, opacity: 1 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="bg-primary-main/20 p-4 rounded-full animate-ping absolute inset-0"></div>
                                            <div className="bg-primary-main text-white p-2 rounded-full shadow-2xl relative z-10 border-2 border-white">
                                                <MapPin className="w-5 h-5 fill-current" />
                                            </div>
                                            <div className="mt-2 bg-white dark:bg-gray-900 px-3 py-1 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                {locationSearch.split(',')[0]} (You)
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {sortedProviders.slice(0, 8).map((provider, idx) => {
                                    const top = [25, 45, 65, 30, 55, 75, 40, 20][idx % 8];
                                    const left = [20, 35, 25, 60, 75, 55, 45, 80][idx % 8];
                                    
                                    return (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1 / mapZoom, opacity: 1 }}
                                            transition={{ delay: idx * 0.1, type: 'spring' }}
                                            key={`pin-${provider.id}`}
                                            className="absolute cursor-pointer z-10 group/pin"
                                            style={{ top: `${top}%`, left: `${left}%` }}
                                        >
                                            <div className="relative">
                                                {/* Price Tag Bubble */}
                                                <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-1.5 rounded-2xl text-sm font-black shadow-xl border border-gray-100 dark:border-gray-700 group-hover/pin:scale-110 group-hover/pin:bg-primary-main group-hover/pin:text-white transition-all">
                                                    ₹{provider.price}
                                                </div>
                                                {/* Pin Tip */}
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-900 mx-auto -mt-0.5 group-hover/pin:border-t-primary-main transition-colors"></div>
                                                
                                                {/* Hover Card (Detailed Popup with Address) */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-800 opacity-0 group-hover/pin:opacity-100 pointer-events-none transition-all translate-y-2 group-hover/pin:translate-y-0 z-40">
                                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50 dark:border-gray-800">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                            {provider.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{provider.name}</p>
                                                            <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                                                <Star className="w-3 h-3 fill-current" /> {provider.rating} ({provider.reviewsCount || 0})
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-primary-main shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Location Address</p>
                                                            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                                                {provider.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {/* Map UI Controls */}
                        <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-50">
                            <button 
                                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2))}
                                className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-main transition-colors border border-gray-100 dark:border-gray-800 active:scale-90"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.6))}
                                className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-main transition-colors border border-gray-100 dark:border-gray-800 active:scale-90"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="absolute left-6 top-6">
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest">
                                    Map Live: {sortedProviders.length} Sitters
                                </span>
                            </div>
                        </div>

                        {/* Interactive Overlay Hint */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-[2px] px-8 py-4 rounded-3xl border border-white/20">
                                <div className="flex flex-col items-center gap-2">
                                    <MapPin className="w-8 h-8 text-primary-main animate-bounce" />
                                    <span className="font-heading font-black text-gray-900 dark:text-white uppercase tracking-tighter text-2xl">Explore Map</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
