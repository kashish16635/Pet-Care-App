import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "CAREGIVER") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ message: "Status is required" }, { status: 400 });
        }

        // Verify the booking belongs to the logged-in caregiver's sitter profile
        const sitter = await prisma.sitter.findUnique({
            where: { userId: session.user.id }
        });

        if (!sitter) {
            return NextResponse.json({ message: "Caregiver profile not found" }, { status: 404 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking || booking.sitterId !== sitter.id) {
            return NextResponse.json({ message: "Booking not found or unauthorized" }, { status: 404 });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        // If confirmed, deduct money from pet owner
        if (status === "Confirmed") {
            await prisma.transaction.create({
                data: {
                    title: `Payment for ${updatedBooking.service}`,
                    amount: -(updatedBooking.totalPrice + 40), // Deduct the money now
                    type: "Debit",
                    status: "Success",
                    userId: booking.userId
                }
            });
        }

        // Add a Notification for the Pet Owner
        await prisma.notification.create({
            data: {
                title: status === "Confirmed" ? "Booking Accepted!" : "Booking Update",
                message: `Caregiver ${sitter.name} has ${status.toLowerCase()} your booking for ${updatedBooking.service}.`,
                type: status === "Confirmed" ? "Success" : "Alert",
                read: false,
                userId: booking.userId
            }
        });

        return NextResponse.json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Booking update error:", error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
