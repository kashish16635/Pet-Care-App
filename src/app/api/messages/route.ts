import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
        return NextResponse.json({ message: "Missing userId parameter" }, { status: 400 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: session.user.id }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Messages fetch error:", error);
        return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { receiverId, content } = await req.json();

        if (!receiverId || !content) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId
            }
        });

        await prisma.notification.create({
            data: {
                title: "New Message",
                message: `You received a new message from ${session.user.name || 'someone'}.`,
                type: "Message",
                userId: receiverId
            }
        });

        return NextResponse.json({ message: "Message sent", data: message }, { status: 201 });
    } catch (error) {
        console.error("Message send error:", error);
        return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
    }
}
