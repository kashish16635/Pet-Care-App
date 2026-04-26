"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Video, Mic, Shield, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function VideoCallPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    const roomName = `PawsAndCare_Booking_${bookingId}`;
    const displayName = session?.user?.name || "User";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            setLoading(false);
        }
    }, [status, router]);

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary-main mb-4" />
                <p className="text-lg font-medium animate-pulse uppercase tracking-widest text-sm">Initializing Secure Connection...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()} 
                        className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-white font-bold leading-tight">Live Session</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">End-to-End Encrypted</p>
                        </div>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-4 bg-gray-800/50 px-4 py-2 rounded-2xl border border-gray-700">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-main" />
                        <span className="text-xs font-bold text-gray-300 uppercase">Secure Room</span>
                    </div>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 relative bg-black">
                <iframe
                    src={`https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.prejoinPageEnabled=false`}
                    allow="camera; microphone; display-capture; autoplay; clipboard-write"
                    className="w-full h-full border-none"
                />
                
                {/* Overlay UI elements if needed */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-8 pointer-events-auto">
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-3 bg-gray-800 rounded-2xl text-white"><Video className="w-5 h-5" /></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Camera</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-3 bg-gray-800 rounded-2xl text-white"><Mic className="w-5 h-5" /></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Mic</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex justify-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Paws & Care Real-Time Communication Layer</p>
            </div>
        </div>
    );
}
