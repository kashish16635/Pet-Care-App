"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Check, Star, Shield, Zap, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"

    const plans = [
        {
            name: "Basic Paw",
            price: "0",
            desc: "Essential features for casual pet owners",
            icon: Zap,
            color: "blue",
            features: [
                "Book up to 2 services/month",
                "Basic sitter profiles",
                "Email support",
                "Standard background checks"
            ],
            buttonText: "Current Plan",
            highlight: false
        },
        {
            name: "Premium Pet",
            price: billingCycle === "monthly" ? "400" : (400 * 12 * 0.8).toString(),
            desc: "Most popular choice for active pet families",
            icon: Crown,
            color: "rose",
            features: [
                "Unlimited service bookings",
                "Priority sitter matching",
                "24/7 Veterinary chat support",
                "Premium insurance coverage",
                "Advanced sitter badges",
                "No service fees"
            ],
            buttonText: "Upgrade to Pro",
            highlight: true
        },
        {
            name: "Ultimate Care",
            price: billingCycle === "monthly" ? "800" : (800 * 12 * 0.8).toString(),
            desc: "Complete peace of mind for your furry friends",
            icon: Shield,
            color: "emerald",
            features: [
                "Everything in Premium",
                "Home camera monitoring access",
                "Personalized diet plans",
                "Monthly pet treat box",
                "VIP Emergency transport",
                "Early access to new features"
            ],
            buttonText: "Go Ultimate",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-950 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-rose-100 dark:border-rose-800"
                    >
                        Pricing Plans
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-8"
                    >
                        Choose the <span className="text-gradient">Perfect Care</span> for Your Pet
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto"
                    >
                        Unlock exclusive features, priority support, and peace of mind with our flexible subscription plans.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 flex items-center justify-center gap-6"
                    >
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`text-sm font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'text-primary-main scale-110' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-full relative p-1 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <motion.div 
                                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                                className="w-6 h-6 bg-white rounded-full shadow-lg"
                            />
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`flex flex-col items-start transition-all ${billingCycle === 'yearly' ? 'scale-110' : 'hover:scale-105'}`}
                        >
                            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-primary-main' : 'text-gray-400'}`}>Yearly</span>
                            <span className="text-[9px] text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800 font-bold whitespace-nowrap mt-1">Save 20%</span>
                        </button>
                    </motion.div>
                </div>

                {/* Pricing Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            className={`relative rounded-[3rem] p-10 flex flex-col h-full border-2 transition-all duration-500 ${plan.highlight ? 'border-primary-main bg-white dark:bg-gray-900 shadow-2xl shadow-primary-main/20 scale-105 z-10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-brand text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    Best Value
                                </div>
                            )}

                            <div className="mb-10">
                                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${plan.color === 'rose' ? 'bg-rose-100 text-rose-600' : plan.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <plan.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{plan.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{plan.desc}</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-all">₹{Number(plan.price).toLocaleString()}</span>
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                                <div className="h-6 mt-2">
                                    {plan.price !== "0" && (
                                        <motion.p 
                                            key={billingCycle}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-green-500' : 'text-primary-main'}`}
                                        >
                                            {billingCycle === "yearly" ? "Billed Annually (Save 20%)" : "Billed Monthly"}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, fidx) => (
                                    <div key={fidx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-primary-main text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 tracking-tight leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all h-auto ${plan.highlight ? 'bg-gradient-brand text-white shadow-xl shadow-primary-main/20 hover:scale-[1.02]' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {plan.buttonText}
                                {!plan.buttonText.includes("Current") && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
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
