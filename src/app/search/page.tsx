"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Star, ShieldCheck, Filter, X, Plus, Minus, Crown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center text-gray-400">Loading Interactive Map...</div>
});

const CITY_COORDINATES: { [key: string]: [number, number] } = {
    "Mumbai, Maharashtra": [19.0760, 72.8777],
    "Delhi, Delhi": [28.6139, 77.2090],
    "Bangalore, Karnataka": [12.9716, 77.5946],
    "Hyderabad, Telangana": [17.3850, 78.4867],
    "Ahmedabad, Gujarat": [23.0225, 72.5714],
    "Chennai, Tamil Nadu": [13.0827, 80.2707],
    "Kolkata, West Bengal": [22.5726, 88.3639],
    "Surat, Gujarat": [21.1702, 72.8311],
    "Pune, Maharashtra": [18.5204, 73.8567],
    "Jaipur, Rajasthan": [26.9124, 75.7873],
    "Lucknow, Uttar Pradesh": [26.8467, 80.9462],
    "Kanpur, Uttar Pradesh": [26.4499, 80.3319],
    "Nagpur, Maharashtra": [21.1458, 79.0882],
    "Indore, Madhya Pradesh": [22.7196, 75.8577],
    "Thane, Maharashtra": [19.2183, 72.9781],
    "Bhopal, Madhya Pradesh": [23.2599, 77.4126],
    "Visakhapatnam, Andhra Pradesh": [17.6868, 83.2185],
    "Pimpri-Chinchwad, Maharashtra": [18.6298, 73.7997],
    "Patna, Bihar": [25.5941, 85.1376],
    "Vadodara, Gujarat": [22.3072, 73.1812],
    "Ghaziabad, Uttar Pradesh": [28.6692, 77.4538],
    "Ludhiana, Punjab": [30.9010, 75.8573],
    "Agra, Uttar Pradesh": [27.1767, 78.0081],
    "Nashik, Maharashtra": [19.9975, 73.7898],
    "Faridabad, Haryana": [28.4089, 77.3178],
    "Meerut, Uttar Pradesh": [28.9845, 77.7064],
    "Rajkot, Gujarat": [22.3039, 70.8022],
    "Varanasi, Uttar Pradesh": [25.3176, 82.9739],
    "Srinagar, Jammu and Kashmir": [34.0837, 74.7973],
    "Aurangabad, Maharashtra": [19.8762, 75.3433],
    "Dhanbad, Jharkhand": [23.7957, 86.4304],
    "Amritsar, Punjab": [31.6340, 74.8723],
    "Navi Mumbai, Maharashtra": [19.0330, 73.0297],
    "Allahabad, Uttar Pradesh": [25.4358, 81.8463],
    "Ranchi, Jharkhand": [23.3441, 85.3096],
    "Gwalior, Madhya Pradesh": [26.2124, 78.1772],
    "Jabalpur, Madhya Pradesh": [23.1815, 79.9864],
    "Coimbatore, Tamil Nadu": [11.0168, 76.9558],
    "Vijayawada, Andhra Pradesh": [16.5062, 80.6480],
    "Jodhpur, Rajasthan": [26.2389, 73.0243],
    "Madurai, Tamil Nadu": [9.9252, 78.1198],
    "Raipur, Chhattisgarh": [21.2514, 81.6296],
    "Kota, Rajasthan": [25.2138, 75.8648],
    "Guwahati, Assam": [26.1445, 91.7362],
    "Chandigarh, Chandigarh": [30.7333, 76.7794],
    "Ujjain, Madhya Pradesh": [23.1760, 75.7885],
    "Gurgaon, Haryana": [28.4595, 77.0266],
    "Noida, Uttar Pradesh": [28.5355, 77.3910],
    "Dehradun, Uttarakhand": [30.3165, 78.0322],
    "Kochi, Kerala": [9.9312, 76.2673],
    "Bhubaneswar, Odisha": [20.2961, 85.8245],
    "Mysore, Karnataka": [12.2958, 76.6394],
    "Udaipur, Rajasthan": [24.5854, 73.7125],
};

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
    const [priceRange, setPriceRange] = useState<number>(5000);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("recommended");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
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

    // Helper to mock availability data for now
    const augmentProvider = (p: any) => {
        const nameLower = p.name.toLowerCase();
        
        // Rahul Verma is ALWAYS Open
        if (nameLower.includes("rahul")) {
            return { ...p, is24x7: false, openTime: "00:00", closeTime: "23:59" };
        }
        
        const is24x7 = p.name.length % 2 === 0; // ~50% are 24/7 for a good list representation
        
        // Mixed working hours for variety
        let openTime = "08:00";
        let closeTime = "20:00";
        
        if (p.name.length % 3 === 1) {
            closeTime = "23:59"; // Open late
        } else if (p.name.length % 3 === 2) {
            closeTime = "18:00"; // Closed early (already closed)
        }
        
        return { ...p, is24x7, openTime, closeTime };
    };

    const isOpen = (provider: any) => {
        if (provider.is24x7) return true;
        const now = new Date();
        const currentTime = now.getHours() + now.getMinutes() / 60;
        const [openH, openM] = provider.openTime.split(':').map(Number);
        const [closeH, closeM] = provider.closeTime.split(':').map(Number);
        return currentTime >= (openH + openM / 60) && currentTime <= (closeH + closeM / 60);
    };

    // Apply Filters and Sorting
    const filteredAndSortedProviders = [...providers]
        .map(augmentProvider)
        .filter(p => p.price <= priceRange && p.rating >= minRating)
        .filter(p => isEmergency ? p.is24x7 : true)
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            
            // Default: Recommended (Search City Match first)
            if (!locationSearch) return 0;
            const cleanSearchCity = locationSearch.split(',')[0].trim().toLowerCase();
            const aMatches = a.location.toLowerCase().includes(cleanSearchCity);
            const bMatches = b.location.toLowerCase().includes(cleanSearchCity);
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
                            <div className="flex items-center gap-3 relative">
                                <button 
                                    onClick={() => setIsEmergency(!isEmergency)}
                                    className={`backdrop-blur-xl px-4 py-2.5 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-left outline-none ${
                                        isEmergency 
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.3)] hover:bg-amber-600' 
                                        : 'bg-white/95 dark:bg-gray-900/95 border-white dark:border-gray-800 text-gray-900 dark:text-white hover:scale-[1.02]'
                                    }`}
                                >
                                    {isEmergency ? (
                                        <>
                                            <div className="relative shrink-0">
                                                <div className="relative h-8 w-8 bg-white/20 rounded-full flex items-center justify-center shadow-sm">
                                                    <span className="text-xs font-bold text-white">✕</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-white">Emergency Active</span>
                                                    <div className="flex h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                                                </div>
                                                <p className="text-[7.5px] font-black text-amber-100 uppercase tracking-[0.15em] mt-0.5">Click to Reset</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative shrink-0">
                                                <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-25" />
                                                <div className="relative h-8 w-8 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center shadow-sm">
                                                    <Crown className="w-4 h-4 text-amber-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-900 dark:text-white">24/7 Emergency</span>
                                                    <div className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-pulse" />
                                                </div>
                                                <p className="text-[7.5px] font-black text-gray-400 uppercase tracking-[0.15em] mt-0.5">Immediate Help</p>
                                            </div>
                                        </>
                                    )}
                                </button>

                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`flex items-center gap-2 ${isFilterOpen ? 'bg-primary-main text-white' : ''}`}
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                >
                                    <Filter className="w-4 h-4" /> 
                                    {isFilterOpen ? "Close Filters" : "Filters"}
                                </Button>

                                <AnimatePresence>
                                    {isFilterOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-[100]"
                                        >
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Max Price: ₹{priceRange}</label>
                                                    <input 
                                                        type="range" 
                                                        min="100" 
                                                        max="5000" 
                                                        step="100"
                                                        value={priceRange}
                                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                                        className="w-full accent-primary-main"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Min Rating</label>
                                                    <div className="flex gap-2">
                                                        {[0, 3, 4, 4.5].map((r) => (
                                                            <button 
                                                                key={r}
                                                                onClick={() => setMinRating(r)}
                                                                className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${minRating === r ? 'bg-primary-main text-white border-primary-main' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600'}`}
                                                            >
                                                                {r === 0 ? "Any" : `${r}+ ⭐`}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sort By</label>
                                                    <select 
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs font-bold outline-none"
                                                    >
                                                        <option value="recommended">Recommended</option>
                                                        <option value="price-low">Price: Low to High</option>
                                                        <option value="price-high">Price: High to Low</option>
                                                        <option value="rating">Highest Rated</option>
                                                    </select>
                                                </div>



                                                <Button 
                                                    className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                                    onClick={() => setIsFilterOpen(false)}
                                                >
                                                    Apply Filters
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {!loading && filteredAndSortedProviders.map((provider, idx) => (
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
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white group-hover:text-primary-main transition-colors">{provider.name}</h3>
                                                {provider.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                                                
                                                {/* Availability Badge */}
                                                {provider.is24x7 ? (
                                                    <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                                        <Crown className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                                                        24/7 Available
                                                    </span>
                                                ) : isOpen(provider) ? (
                                                    <span className="ml-2 px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-200 dark:border-green-800">🟢 Open Now</span>
                                                ) : (
                                                    <span className="ml-2 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700">🔴 Closed</span>
                                                )}
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

                    {/* RIGHT: REAL GOOGLE MAPS VIEW */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-24 h-[calc(100vh-120px)] rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 relative shadow-xl z-10">
                        <Map 
                            providers={filteredAndSortedProviders}
                            center={CITY_COORDINATES[locationSearch] || [20.5937, 78.9629]}
                            zoom={locationSearch ? 12 : 5}
                            onMarkerClick={(provider) => setSelectedProvider(provider)}
                            cityCoordinates={CITY_COORDINATES}
                        />

                        {/* Detail Popover */}

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
