import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = session.user.id;

        // Fetch all messages involving this user
        const allMessages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: { select: { id: true, name: true, image: true } },
                receiver: { select: { id: true, name: true, image: true } }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Group into conversations (latest message per user)
        const conversationsMap = new Map();

        allMessages.forEach(msg => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    otherUser,
                    latestMessage: msg.content,
                    createdAt: msg.createdAt,
                    unread: false // Can be expanded later
                });
            }
        });

        const inbox = Array.from(conversationsMap.values());

        return NextResponse.json(inbox);
    } catch (error) {
        console.error("Inbox fetch error:", error);
        return NextResponse.json({ message: "Failed to fetch inbox" }, { status: 500 });
    }
}
