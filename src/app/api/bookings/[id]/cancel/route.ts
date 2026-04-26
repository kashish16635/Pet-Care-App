import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Find the booking and verify ownership
        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        if (booking.userId !== (session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Update status to Cancelled
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: "Cancelled" }
        });

        // 2. Create a Refund Transaction
        await prisma.transaction.create({
            data: {
                title: "Refund: Booking Cancelled",
                subtitle: `Service: ${updatedBooking.service}`,
                amount: updatedBooking.totalPrice, // Positive amount for credit
                type: "Credit",
                status: "Completed",
                userId: (session.user as any).id
            }
        });

        // 3. Add Notifications
        // For User
        await prisma.notification.create({
            data: {
                title: "Refund Processed",
                message: `₹${updatedBooking.totalPrice} has been credited back to your wallet for the cancelled booking.`,
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
                    title: "Booking Cancelled",
                    message: `The booking for ${updatedBooking.service} on ${updatedBooking.date} has been cancelled by the owner.`,
                    type: "Alert",
                    read: false,
                    userId: sitter.userId
                }
            });
        }
        
        return NextResponse.json({ message: "Booking cancelled and refund processed", booking: updatedBooking });
    } catch (error) {
        console.error("Cancel booking error:", error);
        return NextResponse.json({ message: "Failed to cancel booking", error }, { status: 500 });
    }
}
