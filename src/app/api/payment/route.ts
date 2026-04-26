import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { bookingId, amount } = body;

        // 1. Keep booking as Pending (Caregiver must manually confirm)
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "Pending" }
        });

        // 2. Add transaction record
        await prisma.transaction.create({
            data: {
                title: "Payment to Sitter",
                amount: -Math.abs(amount), // Deduct money
                type: "Debit",
                status: "Success",
                userId: (session.user as any).id
            }
        });

        // 3. Add Notifications
        // For User
        await prisma.notification.create({
            data: {
                title: "Payment Successful",
                message: `Your booking request for ${updatedBooking.service} has been sent! Waiting for caregiver approval.`,
                type: "Success",
                read: false,
                userId: (session.user as any).id
            }
        });

        // For Caregiver
        const sitter = await prisma.sitter.findUnique({
            where: { id: updatedBooking.sitterId }
        });
        
        if (sitter) {
            await prisma.notification.create({
                data: {
                    title: "New Booking Request!",
                    message: `You have a new request for ${updatedBooking.service} on ${updatedBooking.date}. Please review and confirm.`,
                    type: "Alert",
                    read: false,
                    userId: sitter.userId
                }
            });
        }

        return NextResponse.json({ message: "Payment successful" }, { status: 200 });

    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ message: "Payment failed", error }, { status: 500 });
    }
}
