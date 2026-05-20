import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Delete the user record
        // This will cascade delete pets, bookings, transactions, etc. if set up in schema
        // Note: Prisma cascade delete only works if explicitly set up or if manually handled.
        // Our schema has 'onDelete: Cascade' for Pet, Sitter, Transaction, etc.
        
        await prisma.user.delete({
            where: { email: session.user.email }
        });

        return NextResponse.json({ message: "Account successfully deactivated" });
    } catch (error) {
        console.error("Deactivation error:", error);
        return NextResponse.json({ 
            message: "Failed to deactivate account",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
