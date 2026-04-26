"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, MapPin, Bone, Activity, Edit3, Plus, X, Camera } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [isAddingPet, setIsAddingPet] = useState(false);
    const [editingPet, setEditingPet] = useState<any>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [petImagePreview, setPetImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const petFileInputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "pets") {
            setActiveTab("pets");
        } else if (tab === "profile") {
            setActiveTab("profile");
        }
    }, [searchParams]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local image immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile((prev: any) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPetImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        // Include the current profile image (might be Base64 from preview)
        const updateData = { ...data, image: profile.image };

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });
            const result = await res.json();
            if (res.ok) {
                setProfile(result.user);
                alert("Profile updated successfully!");
            } else {
                alert(result.message || "Failed to update profile");
            }
        } catch (error) {
            alert("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddPet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        // Include the pet image Base64
        const petData = { 
            ...data, 
            image: petImagePreview || (editingPet ? editingPet.image : null),
            id: editingPet ? editingPet.id : undefined 
        };

        try {
            const res = await fetch("/api/user/pets", {
                method: editingPet ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(petData)
            });
            const result = await res.json();
            if (res.ok) {
                // Refresh profile to show new pet
                await fetchProfile();
                setIsAddingPet(false);
                setEditingPet(null);
                setPetImagePreview(null);
                alert(editingPet ? "Pet updated successfully!" : "Pet added successfully!");
            } else {
                alert(result.message || "Failed to save pet");
            }
        } catch (error) {
            alert("An error occurred while saving pet.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePet = async (id: string) => {
        if (!confirm("Are you sure you want to remove this pet profile?")) return;
        
        try {
            const res = await fetch(`/api/user/pets?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                await fetchProfile();
                alert("Pet profile removed.");
            } else {
                alert("Failed to delete pet profile.");
            }
        } catch (error) {
            alert("An error occurred during deletion.");
        }
    };

    const openEditModal = (pet: any) => {
        setEditingPet(pet);
        setPetImagePreview(pet.image);
        setIsAddingPet(true);
    };

    const closePetModal = () => {
        setIsAddingPet(false);
        setEditingPet(null);
        setPetImagePreview(null);
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Please log in</h1>
            <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#fafafc] dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-28 pb-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">

                {/* Header Section */}
                <div className="flex flex-col mb-10">
                    <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your profile information and pet details.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-10 p-1 bg-white dark:bg-gray-900 rounded-2xl w-fit shadow-sm border border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-8 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${activeTab === 'profile' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("pets")}
                        className={`px-8 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${activeTab === 'pets' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        My Pets
                    </button>
                </div>

                {/* --- OWNER PROFILE TAB --- */}
                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Sidebar Avatar Card */}
                        <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center h-fit sticky top-28">
                            <div className="relative group mb-6">
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-light to-secondary-light p-1.5 shadow-xl shadow-primary-main/10 ring-4 ring-white dark:ring-gray-800 overflow-hidden">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                        {profile?.image ? (
                                            <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl font-black text-primary-main">{profile?.name?.charAt(0) || "U"}</span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-primary-main hover:scale-110 transition-transform"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                            
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{profile?.name || "User"}</h2>
                                <p className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Owner Profile</p>
                            </div>

                            <div className="w-full space-y-3">
                                <Button variant="outline" className="w-full rounded-2xl py-6 font-bold border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => fileInputRef.current?.click()}>
                                    {profile?.image ? "Change Photo" : "Upload Photo"}
                                </Button>
                            </div>
                        </div>

                        {/* Info Form Card */}
                        <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary-main/10 rounded-2xl">
                                    <User className="w-6 h-6 text-primary-main" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Personal Details</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update your basic information</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-main w-5 h-5 transition-colors" />
                                            <input type="text" name="name" defaultValue={profile?.name || ""} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email (Read-Only)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input type="email" disabled defaultValue={profile?.email || ""} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-50 dark:border-gray-700 opacity-60 outline-none font-bold text-gray-500 cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-main w-5 h-5 transition-colors" />
                                            <input type="tel" name="phone" defaultValue={profile?.phone || ""} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-8 pt-4">
                                    <div className="p-3 bg-secondary-main/10 rounded-2xl">
                                        <MapPin className="w-6 h-6 text-secondary-main" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Address Details</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Where you and your pets live</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-8 mb-12">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Street Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary-main w-5 h-5 transition-colors" />
                                            <input type="text" name="address" defaultValue={profile?.address || ""} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-secondary-main/10 focus:border-secondary-main transition-all outline-none font-bold text-gray-900 dark:text-white shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">City</label>
                                            <input type="text" name="city" defaultValue={profile?.city || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-secondary-main/10 focus:border-secondary-main transition-all outline-none font-bold text-gray-900 dark:text-white shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">PIN Code</label>
                                            <input type="text" name="pinCode" defaultValue={profile?.pinCode || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-secondary-main/10 focus:border-secondary-main transition-all outline-none font-bold text-gray-900 dark:text-white shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={saving} className="px-10 py-7 rounded-2xl text-[15px] font-black uppercase tracking-widest shadow-xl shadow-primary-main/30 hover:-translate-y-1 transition-transform">
                                        {saving ? "Saving..." : "Update Profile"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MY PETS TAB --- */}
                {activeTab === "pets" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {profile?.pets?.map((pet: any) => (
                            <div key={pet.id} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:border-primary-main/30 hover:shadow-xl hover:shadow-primary-main/5 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                
                                <div className="z-10 relative">
                                    <div className="w-24 h-24 rounded-3xl bg-secondary-light dark:bg-gray-800 p-1 mb-6 shadow-lg shadow-secondary-main/10 group-hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                            {pet.image ? (
                                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-secondary-main text-3xl font-black uppercase">{pet.name.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight group-hover:text-primary-main transition-colors">{pet.name}</h3>
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                                {pet.breed || pet.type} • {pet.age || "Unknown age"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-50 dark:border-gray-700">
                                            <Bone className="w-4 h-4 text-primary-main" />
                                            <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300">{pet.diet || "Standard Diet"}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-xl font-bold text-xs" onClick={() => openEditModal(pet)}>Edit Info</Button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id); }}
                                            className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Pet Card */}
                        <div 
                            onClick={() => setIsAddingPet(true)}
                            className="bg-white dark:bg-gray-900/40 rounded-[2rem] p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white dark:hover:bg-gray-900 hover:border-primary-main/30 hover:shadow-xl transition-all min-h-[340px] group"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary-main/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-primary-main text-white flex items-center justify-center shadow-lg shadow-primary-main/20">
                                    <Plus className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Add Another Pet</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-[180px]">New furry friend joined your home?</p>
                        </div>
                    </div>
                )}


                {/* --- ADD/EDIT PET MODAL --- */}
                {isAddingPet && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="px-10 py-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{editingPet ? "Edit Pet Details" : "Add New Pet"}</h2>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Make your pet's profile look amazing</p>
                                </div>
                                <button onClick={closePetModal} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-primary-main transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddPet} className="p-10">
                                <div className="space-y-6 mb-10">
                                    <div className="flex flex-col items-center mb-8">
                                        <div 
                                            onClick={() => petFileInputRef.current?.click()}
                                            className="w-32 h-32 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-primary-main transition-all"
                                        >
                                            {petImagePreview ? (
                                                <img src={petImagePreview} alt="Pet preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Camera className="text-gray-300 w-10 h-10 group-hover:text-primary-main transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={petFileInputRef} 
                                            onChange={handlePetImageChange} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">{editingPet ? "Change Pet Photo" : "Upload Pet Photo"}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet Name*</label>
                                            <input type="text" name="name" defaultValue={editingPet?.name} required className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet Type*</label>
                                            <select name="type" defaultValue={editingPet?.type || "Dog"} required className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white appearance-none">
                                                <option value="Dog">Dog</option>
                                                <option value="Cat">Cat</option>
                                                <option value="Bird">Bird</option>
                                                <option value="Rabbit">Rabbit</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Breed</label>
                                            <input type="text" name="breed" defaultValue={editingPet?.breed} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white" placeholder="Golden Retriever" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                            <input type="text" name="age" defaultValue={editingPet?.age} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-main/10 focus:border-primary-main transition-all outline-none font-bold text-gray-900 dark:text-white" placeholder="2 years" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    <Button type="button" variant="ghost" className="flex-1 py-7 font-black uppercase tracking-widest text-[13px] rounded-2xl" onClick={closePetModal}>Cancel</Button>
                                    <Button type="submit" className="flex-1 py-7 font-black uppercase tracking-widest text-[13px] rounded-2xl shadow-xl shadow-primary-main/20" disabled={saving}>
                                        {saving ? "Saving..." : (editingPet ? "Update Pet" : "Add Pet")}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
