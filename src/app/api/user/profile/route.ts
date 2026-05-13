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
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { pets: true }
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, phone, address, city, pinCode, image } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                ...(name && { name }),
                ...(phone !== undefined && { phone }),
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(pinCode !== undefined && { pinCode }),
                ...(image !== undefined && { image })
            }
        });

        return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Failed to update profile", error }, { status: 500 });
    }
}
