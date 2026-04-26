import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const count = await prisma.sitter.count();
        if (count > 0) {
            return NextResponse.json({ message: "Already seeded" });
        }

        const sitters = [
            {
                name: "Sneha Sharma",
                type: "Certified Pet Sitter & Walker",
                location: "Bandra West, Mumbai",
                distance: "2.5 km away",
                rating: 4.9,
                reviews: 124,
                price: 800,
                about: "Hi! I'm Sneha, a lifelong animal lover and certified pet sitter...",
                verified: true,
                image: "SS"
            },
            {
                name: "Happy Paws Boarding",
                type: "Boarding Center",
                location: "Koramangala, Bangalore",
                distance: "5.0 km away",
                rating: 4.8,
                reviews: 89,
                price: 1500,
                about: "A spacious, stress-free boarding center with dedicated play areas.",
                verified: true,
                image: "HP"
            },
            {
                name: "Rahul Verma",
                type: "Dog Walker & Sitter",
                location: "South Ex, Delhi",
                distance: "1.2 km away",
                rating: 5.0,
                reviews: 210,
                price: 500,
                about: "I am Rahul, providing energetic dog walks and drop-in visits.",
                verified: true,
                image: "RV"
            },
            {
                name: "Cozy Cats Inn",
                type: "Boarding Center",
                location: "Andheri West, Mumbai",
                distance: "8.4 km away",
                rating: 4.7,
                reviews: 56,
                price: 1200,
                about: "A cat-exclusive boarding facility designed to keep your feline friends calm.",
                verified: false,
                image: "CC"
            }
        ];

        for (const sitter of sitters) {
            await prisma.sitter.create({ data: sitter });
        }

        return NextResponse.json({ message: "Seeded successfully" });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
