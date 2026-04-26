import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "CAREGIVER") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const sitter = await prisma.sitter.findUnique({
            where: { userId: session.user.id },
            include: { bookings: true }
        });
        
        if (!sitter) {
            return NextResponse.json({ message: "Caregiver profile not found" }, { status: 404 });
        }
        
        return NextResponse.json(sitter);
    } catch (error) {
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
