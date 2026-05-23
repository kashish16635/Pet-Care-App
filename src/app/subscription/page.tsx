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
                <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
                    <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-6" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter animate-pulse">Securing Payment...</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Connecting to Gateway</p>
                </div>
            )}
            
            {/* Payment Modal */}
            <AnimatePresence>
                {selectedPlan && !isProcessing && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlan(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Complete Payment</h2>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">You are upgrading to {selectedPlan.name}</p>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Plan</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedPlan.name}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Billing Cycle</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{billingCycle}</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Total</span>
                                    <span className="text-xl font-black text-rose-500 tracking-tighter">₹{selectedPlan.price}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Card Information</label>
                                    <input type="text" placeholder="Card Number" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-t-2xl rounded-b-sm p-4 text-sm font-bold mb-1 outline-none focus:ring-2 focus:ring-rose-500" />
                                    <div className="flex gap-1">
                                        <input type="text" placeholder="MM/YY" className="w-1/2 bg-gray-50 dark:bg-gray-800 border-none rounded-bl-2xl rounded-tr-sm p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500" />
                                        <input type="text" placeholder="CVC" className="w-1/2 bg-gray-50 dark:bg-gray-800 border-none rounded-br-2xl rounded-tl-sm p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">Name on Card</label>
                                    <input type="text" placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500" />
                                </div>
                            </div>

                            <Button onClick={() => handleUpgrade(selectedPlan.name)} className="w-full py-6 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs">
                                Pay ₹{selectedPlan.price}
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <Navbar />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-900/10 -z-10 blur-3xl opacity-50" />
                
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Choose Your Plan</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.85] mb-8"
                    >
                        Elevate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Pet's Life</span>
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-2 rounded-full border border-white dark:border-gray-800 w-fit mx-auto shadow-sm"
                    >
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Yearly
                            <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-950">
                                -20%
                            </span>
                        </button>
                    </motion.div>
                </div>

                {/* Pricing Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className={`group relative rounded-[3.5rem] p-1 bg-gradient-to-b ${plan.highlight ? 'from-rose-500 via-orange-500 to-rose-500' : 'from-gray-200 dark:from-gray-800 to-transparent'} transition-all duration-700 hover:scale-[1.02]`}
                        >
                            <div className="bg-white dark:bg-gray-950 rounded-[3.4rem] h-full p-10 flex flex-col relative overflow-hidden">
                                {/* Glass Background Effect */}
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${plan.gradient} rounded-full blur-3xl -mr-20 -mt-20 opacity-50 transition-transform group-hover:scale-150 duration-700`} />
                                
                                {plan.highlight && (
                                    <div className="absolute top-8 right-10 flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Popular</span>
                                    </div>
                                )}

                                <div className="mb-12 relative">
                                    <div className={`w-16 h-16 rounded-[1.5rem] mb-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-transform group-hover:-rotate-12 duration-500 ${plan.textColor}`}>
                                        <plan.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{plan.name}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-[200px] leading-relaxed">{plan.desc}</p>
                                </div>

                                <div className="mb-12">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-gray-400 uppercase">₹</span>
                                        <motion.span 
                                            key={plan.price}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter"
                                        >
                                            {plan.price}
                                        </motion.span>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                        {billingCycle === 'yearly' ? 'Billed once annually' : 'Auto-renewing monthly'}
                                    </p>
                                </div>

                                <div className="space-y-5 mb-12 flex-1">
                                    {plan.features.map((feature, fidx) => (
                                        <div key={fidx} className="flex items-center gap-4 group/item">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors group-hover/item:bg-gray-900 dark:group-hover/item:bg-white group-hover/item:text-white dark:group-hover/item:text-black">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-600 dark:text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors uppercase tracking-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    onClick={() => plan.id !== 'basic' && setSelectedPlan(plan)}
                                    className={`w-full py-8 rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] transition-all h-auto group-hover:shadow-2xl ${plan.highlight ? 'bg-gray-900 text-white dark:bg-white dark:text-black hover:scale-[1.02]' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                >
                                    {plan.buttonText}
                                    {plan.id !== "basic" && <ArrowRight className="w-4 h-4 ml-2" />}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mt-32 text-center">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-12">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <h4 className="text-[13px] font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">Can I cancel anytime?</h4>
                            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-tight">Yes, you can cancel your subscription at any time through your account settings without any cancellation fees.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <h4 className="text-[13px] font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">What payment methods are accepted?</h4>
                            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-tight">We accept all major credit/debit cards, UPI, and popular digital wallets for your convenience.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
