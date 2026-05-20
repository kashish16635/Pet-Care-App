import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    try {
        // Fetch upcoming bookings (status: Confirmed or Pending)
        const upcomingBookings = await prisma.booking.findMany({
            where: { 
                userId, 
                status: { in: ["Confirmed", "Pending"] } 
            },
            include: { sitter: true, pet: true },
            orderBy: { date: 'asc' },
            take: 1
        });

        // Fetch past bookings (status: Completed)
        const pastBookings = await prisma.booking.findMany({
            where: { userId, status: "Completed" },
            include: { sitter: true, pet: true },
            orderBy: { date: 'desc' },
            take: 5
        });

        // Compute balance tracking all transaction history
        const transactions = await prisma.transaction.findMany({ where: { userId } });
        const initialBalance = 13250; // Let's give all mock users a starting balance 
        const balance = transactions.reduce((sum: number, tx: any) => sum + tx.amount, initialBalance);

        // Fetch user notifications
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        return NextResponse.json({
            upcomingBooking: upcomingBookings.length > 0 ? upcomingBookings[0] : null,
            pastBookings,
            balance,
            notifications
        });
    } catch(err) {
        console.error("Dashboard API Error:", err);
        return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
    }
}
