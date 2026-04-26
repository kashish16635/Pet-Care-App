"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from "lucide-react";

export default function WalletPage() {
    const { status } = useSession();
    const [showAddModal, setShowAddModal] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' or 'card'

    const fetchData = () => {
        setLoading(true);
        fetch("/api/wallet")
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const handleAddFunds = async () => {
        if (!amountToAdd || isNaN(parseFloat(amountToAdd))) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountToAdd })
            });
            if (res.ok) {
                setShowAddModal(false);
                setAmountToAdd("");
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-main w-10 h-10"/></div>;
    }

    if (status === "unauthenticated") {
        return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Log in to view wallet</div>;
    }

    const { balance, transactions } = data;

    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-24 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Paws Wallet</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Wallet Card */}
                    <div className="md:col-span-1 bg-primary-main text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full -z-10" />
                        <div>
                            <p className="text-white/80 font-medium mb-1">Available Balance</p>
                            <h2 className="text-4xl font-heading font-bold">₹{balance?.toLocaleString()}</h2>
                        </div>
                        <div className="mt-8">
                            <Button 
                                onClick={() => setShowAddModal(true)}
                                className="w-full bg-white text-primary-main hover:bg-gray-100 font-bold border-none shadow-sm"
                            >
                                + Add Funds
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-main transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ArrowDownLeft className="text-green-600 dark:text-green-400 w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Withdraw</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">To Bank Account</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-main transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Pay Sitter</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Direct Transfer</p>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Recent Transactions</h2>
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions?.length === 0 && <p className="text-gray-500 p-2">No transactions yet.</p>}
                        {transactions?.map((tx: any) => (
                            <div key={tx.id} className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        {tx.amount > 0 ? <ArrowDownLeft className="text-green-500 w-5 h-5"/> : <ArrowUpRight className="text-red-500 w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{tx.title || tx.type}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                                        {tx.amount > 0 ? "+" : ""}₹{tx.amount}
                                    </p>
                                    <p className="text-xs text-green-500 font-medium">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Funds Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center text-primary-main">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Funds</h3>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount to Deposit</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                                        <input 
                                            type="number" 
                                            value={amountToAdd}
                                            onChange={(e) => setAmountToAdd(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full h-14 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-xl font-black focus:border-primary-main focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
                                    <button 
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentMethod === 'upi' ? 'bg-white dark:bg-gray-700 text-primary-main shadow-sm' : 'text-gray-500'}`}
                                    >
                                        UPI (PhonePe/GPay)
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod("card")}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-gray-700 text-primary-main shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Card Details
                                    </button>
                                </div>

                                {paymentMethod === 'upi' ? (
                                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                                        <div className="flex justify-center gap-6 mb-6 opacity-80">
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100">
                                                <span className="text-[10px] font-bold text-blue-600">GPay</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100">
                                                <span className="text-[10px] font-bold text-purple-600">PhnP</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100">
                                                <span className="text-[10px] font-bold text-sky-500">Pytm</span>
                                            </div>
                                        </div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Enter UPI ID</label>
                                        <input 
                                            type="text" 
                                            placeholder="username@okaxis" 
                                            className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-primary-main focus:outline-none"
                                        />
                                        <p className="text-[9px] text-gray-400 mt-3 text-center">We'll send a payment request to this UPI ID</p>
                                    </div>
                                ) : (
                                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    placeholder="Card Number" 
                                                    className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-primary-main focus:outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="MM/YY" className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-primary-main focus:outline-none" />
                                                <input type="password" placeholder="CVV" className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-primary-main focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button 
                                    className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary-main/20"
                                    onClick={handleAddFunds}
                                    disabled={isSubmitting || !amountToAdd}
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Pay ₹${amountToAdd || '0'}`}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
