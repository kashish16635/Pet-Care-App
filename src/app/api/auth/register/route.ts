import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                walletBalance: 2500 // Initial bonus funds for testing
            }
        });

        // Add an initial notification
        await prisma.notification.create({
            data: {
                title: "Welcome to Paws & Care! 🐾",
                message: "We're so excited to have you on board! You've received ₹2500 in bonus credits.",
                type: "Success",
                userId: user.id
            }
        });

        return NextResponse.json({ message: "User registered successfully", ok: true }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "An internal error occurred" }, { status: 500 });
    }
}
