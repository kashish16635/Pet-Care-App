"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Star, ShieldCheck, Filter } from "lucide-react";

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

                    {/* RIGHT: MOCK MAP VIEW */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-24 h-[calc(100vh-120px)] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                        {/* Map Background Pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #000 20px)" }} />

                        {/* Map Pins */}
                        <div className="absolute top-[30%] left-[40%] bg-primary-main text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-bounce cursor-pointer">₹800</div>
                        <div className="absolute top-[50%] left-[60%] bg-secondary-main text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg cursor-pointer">₹1500</div>
                        <div className="absolute top-[20%] left-[70%] bg-white text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg cursor-pointer">₹500</div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full font-heading font-semibold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/50 dark:border-gray-700">
                                Interactive Map View
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
