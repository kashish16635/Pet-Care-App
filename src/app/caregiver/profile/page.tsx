"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CaregiverNavbar } from "@/components/CaregiverNavbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Briefcase, MapPin, DollarSign, User as UserIcon, Search } from "lucide-react";

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
  "Ranchi, Jharkhand", "Howrah, West Bengal", "Coimbatore, Tamil Nadu", "Jabalpur, Madhya Pradesh",
  "Gwalior, Madhya Pradesh", "Vijayawada, Andhra Pradesh", "Jodhpur, Rajasthan", "Madurai, Tamil Nadu",
  "Raipur, Chhattisgarh", "Kota, Rajasthan", "Guwahati, Assam", "Chandigarh, Chandigarh",
  "Solapur, Maharashtra", "Hubli-Dharwad, Karnataka", "Bareilly, Uttar Pradesh", "Moradabad, Uttar Pradesh",
  "Mysore, Karnataka", "Gurgaon, Haryana", "Aligarh, Uttar Pradesh", "Jalandhar, Punjab",
  "Tiruchirappalli, Tamil Nadu", "Bhubaneswar, Odisha", "Salem, Tamil Nadu", "Warangal, Telangana",
  "Mira-Bhayandar, Maharashtra", "Thiruvananthapuram, Kerala", "Bhiwandi, Maharashtra", "Saharanpur, Uttar Pradesh",
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

export default function CaregiverProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        type: "",
        location: "",
        distance: "",
        price: "",
        about: ""
    });

    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/caregiver/login");
        } else if (status === "authenticated" && session?.user?.role === "CAREGIVER") {
            fetchProfile();
        }
    }, [status, session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/caregiver/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData({
                    type: data.type || "",
                    location: data.location || "",
                    distance: data.distance || "",
                    price: data.price?.toString() || "",
                    about: data.about || ""
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/caregiver/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            setMessage("Server error. Try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
            <CaregiverNavbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public partner profile</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
                            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-gray-50 dark:ring-gray-800">
                                {profile?.name?.charAt(0) || "P"}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{session?.user?.email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.includes('successfully') ? 'bg-green-50 text-green-600 dark:bg-green-900/30' : 'bg-red-50 text-red-600 dark:bg-red-900/30'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <Briefcase className="w-4 h-4 text-primary-main" /> Service Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all"
                                        >
                                            <option>Pet Sitter</option>
                                            <option>Boarding Center</option>
                                            <option>Pet Walker</option>
                                            <option>Pet Groomer</option>
                                        </select>
                                    </div>

                                     <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-primary-main" /> Service Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({...formData, location: val});
                                                if (val.length > 0) {
                                                    const filtered = INDIAN_CITIES.filter(city => 
                                                        city.toLowerCase().includes(val.toLowerCase())
                                                    ).slice(0, 5);
                                                    setLocationSuggestions(filtered);
                                                    setShowSuggestions(true);
                                                } else {
                                                    setShowSuggestions(false);
                                                }
                                            }}
                                            onFocus={() => {
                                                if (formData.location.length > 0) setShowSuggestions(true);
                                            }}
                                            onBlur={() => {
                                                // Small timeout to allow clicking the suggestion
                                                setTimeout(() => setShowSuggestions(false), 200);
                                            }}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Ujjain, Madhya Pradesh"
                                        />
                                        {showSuggestions && locationSuggestions.length > 0 && (
                                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                                                {locationSuggestions.map((city, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setFormData({...formData, location: city});
                                                            setShowSuggestions(false);
                                                        }}
                                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                                    >
                                                        <Search className="w-3.5 h-3.5 text-gray-400" />
                                                        {city}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-primary-main" /> Service Radius (e.g. 5 km)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.distance}
                                            onChange={(e) => setFormData({...formData, distance: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-primary-main" /> Price (₹ per day/session)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <UserIcon className="w-4 h-4 text-primary-main" /> About You
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={formData.about}
                                            onChange={(e) => setFormData({...formData, about: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Tell clients about your experience..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button type="submit" disabled={saving} className="bg-gradient-brand text-white font-bold px-8 py-3 rounded-xl h-auto text-base">
                                    {saving ? "Saving Changes..." : "Save Profile"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
