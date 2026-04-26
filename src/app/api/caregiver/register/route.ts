import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, phone, type, location, distance, price, about } = body;

        if (!email || !password || !name || !type || !location || !price) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email },
            include: { sitterProfile: true }
        });

        if (user) {
            if (user.sitterProfile) {
                return NextResponse.json({ message: "User is already registered as a Caregiver. Please login." }, { status: 400 });
            }
            // Upgrade existing user
            user = await prisma.user.update({
                where: { email },
                data: { role: "CAREGIVER" },
                include: { sitterProfile: true }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone,
                    role: "CAREGIVER",
                },
                include: { sitterProfile: true }
            });
        }

        // Create Sitter profile
        const sitter = await prisma.sitter.create({
            data: {
                name,
                type,
                location,
                distance: distance || "5 km",
                rating: 0,
                reviews: 0,
                price: parseInt(price),
                about: about || "",
                verified: true, // Auto-verify for dev
                userId: user.id
            }
        });

        return NextResponse.json({ message: "Caregiver registered successfully", user, sitter }, { status: 201 });
    } catch (error) {
        console.error("Caregiver Registration error:", error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
