import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { isPro: true }
        });

        await prisma.transaction.create({
            data: {
                title: "Pro Upgrade",
                subtitle: "Premium subscription activated",
                type: "Debit",
                amount: 0,
                status: "Completed",
                icon: "Zap",
                userId: user.id
            }
        });

        await prisma.notification.create({
            data: {
                title: "Welcome to Pro!",
                message: "Your Pro Account is now active. Enjoy premium features!",
                type: "Success",
                userId: user.id
            }
        });

        return NextResponse.json({
            message: "Successfully upgraded to Pro Account",
            isPro: true
        });
    } catch (error) {
        console.error("Upgrade error:", error);
        return NextResponse.json({
            message: "Failed to upgrade account",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
