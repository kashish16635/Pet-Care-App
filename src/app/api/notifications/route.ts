import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        console.log("Fetching notifications for userId:", (session.user as any).id);
        const notifications = await prisma.notification.findMany({ 
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${notifications.length} notifications in DB`);
        if (notifications.length === 0) {
            return NextResponse.json([
                { id: "fallback-n1", message: "Welcome to Pet Care! Update your profile.", type: "system", read: false, createdAt: new Date() }
            ]);
        }
        
        return NextResponse.json(notifications);
    } catch(err) {
        return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
    }
}

export async function PUT() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.notification.updateMany({
            where: { userId: (session.user as any).id, read: false },
            data: { read: true }
        });
        return NextResponse.json({ success: true });
    } catch(err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
