"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Send, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [otherUser, setOtherUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchOtherUser = async () => {
        try {
            // Note: We are using the sitter profile endpoint or user profile here.
            // Since id could be a Sitter's userId or just a Sitter id, let's try fetching the sitter.
            const res = await fetch(`/api/sitters/${id}`); // Actually, we might need to fetch user, but we'll adapt.
            // Wait, we don't have a direct /api/sitters/[id] that returns userId easily if we just pass id.
            // For simplicity, let's just use the name if available, or a generic title.
            // The user will pass the actual userId in the URL.
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async () => {
        if (status !== "authenticated") return;
        try {
            const res = await fetch(`/api/messages?userId=${id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                // Scroll only if new messages arrive
            }
        } catch (error) {
            console.error("Fetch messages error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchMessages();
            // Start polling
            const interval = setInterval(() => {
                fetchMessages();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [status, id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageContent = newMessage;
        setNewMessage("");

        // Optimistic UI update
        const tempMsg = {
            id: Date.now().toString(),
            content: messageContent,
            senderId: session?.user?.id,
            receiverId: id,
            createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: id,
                    content: messageContent
                })
            });
            if (!res.ok) {
                // Handle error, maybe remove optimistic message
                console.error("Failed to send message");
            } else {
                fetchMessages(); // Refresh to get the actual DB ID
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Chat...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 font-sans">
            <Navbar />
            
            <main className="flex-1 flex flex-col pt-20 w-full max-w-3xl mx-auto h-full relative">
                
                {/* Chat Header */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 sticky top-20 z-10 shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 bg-primary-light/30 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary-main" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white leading-tight">Chat</h2>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No messages yet</h3>
                            <p className="text-sm text-gray-500">Send a message to start the conversation.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === session?.user?.id;
                            return (
                                <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                                            isMe 
                                                ? 'bg-primary-main text-white rounded-br-sm shadow-md' 
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-light opacity-80' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0">
                    <form onSubmit={handleSend} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-main dark:text-white"
                        />
                        <Button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 shadow-md"
                        >
                            <Send className="w-5 h-5 -ml-1" />
                        </Button>
                    </form>
                </div>

            </main>
        </div>
    );
}
