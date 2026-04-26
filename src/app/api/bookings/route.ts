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
        const { sitterId, service, date, time, instructions, totalPrice, petName } = body;

        // In a real app we'd fetch or create a pet associated with this user.
        // For simplicity, we just save the instructions and no pet id relation directly or create a dummy pet.
        let pet = await prisma.pet.findFirst({
            where: { userId: session.user.id, name: petName }
        });

        if (!pet) {
            pet = await prisma.pet.create({
                data: {
                    name: petName,
                    type: "Unknown", // user should fix this later in profile
                    userId: session.user.id
                }
            });
        }

        const booking = await prisma.booking.create({
            data: {
                service,
                date,
                time,
                instructions,
                status: "Pending",
                totalPrice: parseInt(totalPrice),
                userId: session.user.id,
                sitterId,
                petId: pet.id
            }
        });

        return NextResponse.json({ message: "Booking created", booking }, { status: 201 });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ message: "Failed to create booking", error }, { status: 500 });
    }
}
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: session.user.id },
            include: { sitter: true, pet: true, review: true },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Fetch bookings error:", error);
        return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
    }
}
