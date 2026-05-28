"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Check, Star, Shield, Zap, Crown, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const router = useRouter();

    const { update } = useSession();

    // Ye function payment process simulate karta hai
    const handleUpgrade = async (planName: string) => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/user/upgrade", { method: "POST" });
            if (res.ok) {
                // Session update logic
                await update();
                
                setIsProcessing(false);
                setSelectedPlan(null);
                alert(`Payment Successful! You are now a ${planName} member.`);
                router.push("/dashboard?success=true&pro=true");
            } else {
                throw new Error("Failed to upgrade");
            }
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            alert("Something went wrong with the payment. Please try again.");
        }
    };

    const plans = [
        {
            id: "basic",
            name: "Basic Paw",
            price: "0",
            desc: "Essential features for casual pet owners",
            icon: Zap,
            gradient: "from-blue-500/10 to-cyan-500/10",
            textColor: "text-blue-600",
            features: [
                "Up to 2 service bookings/month",
                "Access to verified sitter profiles",
                "Standard email support"
            ],
            buttonText: "Current Plan",
            isPro: false
        },
        {
            id: "premium",
            name: "Premium Pet",
            price: billingCycle === "monthly" ? "400" : "3,840",
            desc: "Most popular choice for active families",
            icon: Crown,
            gradient: "from-rose-500/20 to-orange-500/20",
            textColor: "text-rose-600",
            features: [
                "Unlimited service bookings",
                "24/7 Veterinary chat support",
                "Priority sitter matching",
                "No service fees on bookings",
                "Exclusive Pro Badge on Profile"
            ],
            buttonText: "Upgrade to Pro",
            highlight: true,
            isPro: true
        },
        {
            id: "ultimate",
            name: "Ultimate Care",
            price: billingCycle === "monthly" ? "800" : "7,680",
            desc: "Complete peace of mind for furry friends",
            icon: Shield,
            gradient: "from-emerald-500/20 to-teal-500/20",
            textColor: "text-emerald-600",
            features: [
                "Everything in Premium",
                "Personalized pet diet plans",
                "Video Call consults with experts",
                "Free Monthly Grooming Session"
            ],
            buttonText: "Go Ultimate",
            isPro: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-950 font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Payment Loading Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight animate-pulse">Securing Payment...</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">Connecting to gateway</p>
                </div>
            )}
            
            {/* Payment Modal */}
            <AnimatePresence>
                {selectedPlan && !isProcessing && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlan(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-0.5">Complete Payment</h2>
                            <p className="text-[11px] text-gray-400 mb-4">You are upgrading to {selectedPlan.name}</p>
                            
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3.5 mb-4 border border-gray-100 dark:border-gray-700/50">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] text-gray-500 font-medium">Plan</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedPlan.name}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] text-gray-500 font-medium">Billing Cycle</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{billingCycle}</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-base font-bold text-rose-500">₹{selectedPlan.price}</span>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-5">
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 block ml-0.5">Card Information</label>
                                    <input type="text" placeholder="Card Number" className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-t-xl rounded-b-sm p-2.5 text-xs font-medium mb-0.5 outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white dark:focus:bg-gray-900 transition-all" />
                                    <div className="flex gap-1">
                                        <input type="text" placeholder="MM/YY" className="w-1/2 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-bl-xl rounded-tr-sm p-2.5 text-xs font-medium outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white dark:focus:bg-gray-900 transition-all" />
                                        <input type="text" placeholder="CVC" className="w-1/2 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-br-xl rounded-tl-sm p-2.5 text-xs font-medium outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white dark:focus:bg-gray-900 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 block ml-0.5">Name on Card</label>
                                    <input type="text" placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-xs font-medium outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white dark:focus:bg-gray-900 transition-all" />
                                </div>
                            </div>

                            <Button onClick={() => handleUpgrade(selectedPlan.name)} className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-xs transition-all hover:opacity-90">
                                Pay ₹{selectedPlan.price}
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <Navbar />

            <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-rose-50/40 to-transparent dark:from-rose-900/10 -z-10 blur-3xl opacity-50" />
                
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-12 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 mb-4"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Choose Your Plan</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3"
                    >
                        Choose the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500">Plan for Your Pet</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 font-medium leading-relaxed"
                    >
                        Simple, transparent pricing to give your furry family members the ultimate care they deserve.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-1 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl p-1 rounded-full border border-gray-200/50 dark:border-gray-800/50 w-fit mx-auto shadow-inner"
                    >
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                                Save 20%
                            </span>
                        </button>
                    </motion.div>
                </div>

                {/* Pricing Grid */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + (idx * 0.08) }}
                            className={`group relative rounded-2xl p-[1px] ${plan.highlight ? 'bg-gradient-to-b from-rose-500 via-pink-500 to-orange-500 shadow-lg shadow-rose-500/5' : 'bg-gray-200/60 dark:bg-gray-800/60'} transition-all duration-500 hover:scale-[1.015] hover:shadow-xl flex flex-col`}
                        >
                            <div className="bg-white dark:bg-gray-950 rounded-[15px] h-full p-6 flex flex-col relative overflow-hidden flex-1">
                                {/* Glass Background Effect */}
                                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${plan.gradient} rounded-full blur-2xl -mr-14 -mt-14 opacity-60 transition-transform group-hover:scale-125 duration-700`} />
                                
                                {plan.highlight && (
                                    <div className="absolute top-5 right-5 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-100/50 dark:border-rose-900/20">
                                        <Star className="w-3 h-3 text-rose-500 fill-rose-500" />
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-rose-500">Most Popular</span>
                                    </div>
                                )}

                                <div className="mb-6 relative">
                                    <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-transform group-hover:-rotate-3 duration-300 ${plan.textColor}`}>
                                        <plan.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-1">{plan.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed">{plan.desc}</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-xs font-semibold text-gray-400">₹</span>
                                        <motion.span 
                                            key={plan.price}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                                        >
                                            {plan.price}
                                        </motion.span>
                                        <span className="text-xs font-medium text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                        {billingCycle === 'yearly' ? 'Billed once annually' : 'Auto-renewing monthly'}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    {plan.features.map((feature, fidx) => (
                                        <div key={fidx} className="flex items-start gap-2.5 group/item">
                                            <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 mt-0.5">
                                                <Check className="w-3 h-3 stroke-[2.5]" />
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium tracking-wide leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    onClick={() => plan.id !== 'basic' && setSelectedPlan(plan)}
                                    className={`w-full py-2.5 rounded-xl font-bold tracking-wider text-[10px] transition-all h-auto flex items-center justify-center gap-1.5 shadow-sm ${plan.highlight ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90 hover:scale-[1.01]' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                                >
                                    {plan.buttonText}
                                    {plan.id !== "basic" && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-20">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Can I cancel anytime?</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">Yes, you can cancel your subscription at any time through your account settings without any cancellation fees.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">What payment methods are accepted?</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">We accept all major credit/debit cards, UPI, and popular digital wallets for your convenience.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
