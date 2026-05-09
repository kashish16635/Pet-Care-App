"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, MapPin, Bone, Activity, Edit3, Plus, X, Camera, Loader2 } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function ProfileContent() {
    const [activeTab, setActiveTab] = useState("profile");
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [isAddingPet, setIsAddingPet] = useState(false);
    const [editingPet, setEditingPet] = useState<any>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [petImagePreview, setPetImagePreview] = useState<string | null>(null);
    const [dietPet, setDietPet] = useState<any>(null);
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

    const getDietPlan = (pet: any) => {
        const type = pet.type?.toLowerCase() || "dog";
        const plans: any = {
            dog: [
                { time: "Morning (8:00 AM)", item: "High-protein Kibble (1 cup)", icon: <Bone className="w-4 h-4 text-primary-main" /> },
                { time: "Afternoon (1:00 PM)", item: "Fruit snack or Chew bone", icon: <Activity className="w-4 h-4 text-secondary-main" /> },
                { time: "Evening (7:00 PM)", item: "Wet Food mix with veggies", icon: <Bone className="w-4 h-4 text-primary-main" /> },
            ],
            cat: [
                { time: "Morning (7:30 AM)", item: "Wet Food (1 can) with Taurine", icon: <Bone className="w-4 h-4 text-primary-main" /> },
                { time: "Afternoon (2:00 PM)", item: "Small portion of dry kibble", icon: <Activity className="w-4 h-4 text-secondary-main" /> },
                { time: "Evening (8:00 PM)", item: "Tuna treat or special cat milk", icon: <Bone className="w-4 h-4 text-primary-main" /> },
            ],
            bird: [
                { time: "Morning", item: "Fresh seed mix & fruit slices", icon: <Bone className="w-4 h-4 text-primary-main" /> },
                { time: "Afternoon", item: "Millet spray or nuts", icon: <Activity className="w-4 h-4 text-secondary-main" /> },
                { time: "Evening", item: "Pelleted diet & clean water", icon: <Bone className="w-4 h-4 text-primary-main" /> },
            ],
            rabbit: [
                { time: "All Day", item: "Unlimited Timothy Hay", icon: <Activity className="w-4 h-4 text-green-500" /> },
                { time: "Morning", item: "Fresh leafy greens (Kale/Spinach)", icon: <Bone className="w-4 h-4 text-primary-main" /> },
                { time: "Evening", item: "Small portion of Rabbit pellets", icon: <Bone className="w-4 h-4 text-primary-main" /> },
            ]
        };
        return plans[type] || plans.dog;
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-main" /></div>;
    }

    if (status === "unauthenticated") {
        return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Please log in</h1>
            <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>;
    }

    return (
        <main className="flex-1 pt-28 pb-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col mb-10">
                <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your profile information and pet details.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-10 p-1 bg-white dark:bg-gray-900 rounded-2xl w-fit shadow-sm border border-gray-100 dark:border-gray-800">
                <button onClick={() => setActiveTab("profile")} className={`px-8 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'profile' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Profile</button>
                <button onClick={() => setActiveTab("pets")} className={`px-8 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'pets' ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>My Pets</button>
            </div>

            {activeTab === "profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center h-fit sticky top-28">
                        <div className="relative group mb-6">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-light to-secondary-light p-1.5 shadow-xl ring-4 ring-white dark:ring-gray-800 overflow-hidden">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                    {profile?.image ? <img src={profile.image} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-5xl font-black text-primary-main">{profile?.name?.charAt(0) || "U"}</span>}
                                </div>
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-primary-main hover:scale-110 transition-transform"><Camera className="w-5 h-5" /></button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        <div className="text-center mb-8"><h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{profile?.name || "User"}</h2><p className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Owner Profile</p></div>
                        <Button variant="outline" className="w-full rounded-2xl py-6 font-bold" onClick={() => fileInputRef.current?.click()}>{profile?.image ? "Change Photo" : "Upload Photo"}</Button>
                    </div>

                    <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" name="name" defaultValue={profile?.name || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-900 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <input type="email" disabled defaultValue={profile?.email || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-50 dark:border-gray-700 opacity-60 outline-none font-bold text-gray-500 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input type="tel" name="phone" defaultValue={profile?.phone || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-8 mb-12">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                                    <input type="text" name="address" defaultValue={profile?.address || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-900 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                        <input type="text" name="city" defaultValue={profile?.city || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-900 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">PIN Code</label>
                                        <input type="text" name="pinCode" defaultValue={profile?.pinCode || ""} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={saving} className="px-10 py-7 rounded-2xl text-[15px] font-black uppercase tracking-widest shadow-xl shadow-primary-main/30">{saving ? "Saving..." : "Update Profile"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === "pets" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    {profile?.pets?.map((pet: any) => (
                        <div key={pet.id} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:border-primary-main/30 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="z-10 relative">
                                <div className="w-24 h-24 rounded-3xl bg-secondary-light dark:bg-gray-800 p-1 mb-6 shadow-lg overflow-hidden flex items-center justify-center">
                                    {pet.image ? <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" /> : <span className="text-secondary-main text-3xl font-black uppercase">{pet.name.charAt(0)}</span>}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{pet.name}</h3>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">{pet.breed || pet.type} • {pet.age || "Age?"}</p>
                                <div className="flex gap-3 mt-auto pt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl font-bold text-xs" onClick={() => openEditModal(pet)}>Edit</Button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id); }} className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div onClick={() => setIsAddingPet(true)} className="bg-white dark:bg-gray-900/40 rounded-[2rem] p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-primary-main transition-all min-h-[300px] group">
                        <div className="w-16 h-16 rounded-full bg-primary-main text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mt-4 uppercase tracking-tight">Add Pet</h3>
                    </div>
                </div>
            )}

            {/* Pet Modal */}
            <AnimatePresence>
                {isAddingPet && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="px-10 py-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{editingPet ? "Edit Pet" : "Add Pet"}</h2>
                                <button onClick={closePetModal} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-primary-main"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleAddPet} className="p-10 overflow-y-auto">
                                <div className="space-y-6 mb-10">
                                    <div className="flex flex-col items-center mb-8">
                                        <div onClick={() => petFileInputRef.current?.click()} className="w-32 h-32 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                                            {petImagePreview ? <img src={petImagePreview} alt="Pet preview" className="w-full h-full object-cover" /> : <Camera className="text-gray-300 w-10 h-10" />}
                                        </div>
                                        <input type="file" ref={petFileInputRef} onChange={handlePetImageChange} className="hidden" accept="image/*" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <input type="text" name="name" defaultValue={editingPet?.name} required placeholder="Pet Name*" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 font-bold" />
                                        <select name="type" defaultValue={editingPet?.type || "Dog"} required className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 font-bold">
                                            <option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Bird">Bird</option><option value="Rabbit">Rabbit</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <input type="text" name="breed" defaultValue={editingPet?.breed} placeholder="Breed" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 font-bold" />
                                        <input type="text" name="age" defaultValue={editingPet?.age} placeholder="Age" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 font-bold" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={closePetModal}>Cancel</Button>
                                    <Button type="submit" className="flex-1 shadow-xl shadow-primary-main/20" disabled={saving}>{saving ? "Saving..." : (editingPet ? "Update" : "Add")}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#fafafc] dark:bg-gray-950 font-sans flex flex-col">
            <Navbar />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary-main" /></div>}>
                <ProfileContent />
            </Suspense>
            <Footer />
        </div>
    );
}
