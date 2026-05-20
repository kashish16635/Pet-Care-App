import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "CAREGIVER") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        // First try the direct link
        let sitter = await prisma.sitter.findUnique({
            where: { userId: session.user.id }
        });
        
        // Fallback: If no direct link, find by name (for the demo)
        if (!sitter && session.user.name.includes("Rahul")) {
            sitter = await prisma.sitter.findFirst({
                where: { name: { contains: "Rahul", mode: "insensitive" } }
            });
        }

        if (!sitter) {
            return NextResponse.json({ message: "Caregiver profile not found" }, { status: 404 });
        }

        // Fetch bookings for this sitter
        const bookings = await prisma.booking.findMany({
            where: { sitterId: sitter.id },
            include: { user: true, pet: true },
            orderBy: { createdAt: 'desc' }
        });
        
        return NextResponse.json({ ...sitter, bookings });
    } catch (error) {
        console.error("Caregiver profile fetch error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "CAREGIVER") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, location, distance, price, about } = body;

        const updatedSitter = await prisma.sitter.update({
            where: { userId: session.user.id },
            data: { 
                ...(type && { type }),
                ...(location && { location }),
                ...(distance && { distance }),
                ...(price && { price: parseInt(price) }),
                ...(about && { about }),
            }
        });

        return NextResponse.json({ message: "Profile updated successfully", sitter: updatedSitter });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Failed to update profile", error }, { status: 500 });
    }
}
