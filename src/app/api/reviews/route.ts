import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { bookingId, sitterId, rating, comment, photos } = body;

        if (!bookingId || !sitterId || !rating) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if review already exists
        const existingReview = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (existingReview) {
            return NextResponse.json({ message: "Review already exists for this booking" }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                photos: JSON.stringify(photos || []), // Save photos array as JSON string
                userId: user.id,
                sitterId,
                bookingId
            }
        });

        // Update sitter rating and review count
        const allSitterReviews = await prisma.review.findMany({
            where: { sitterId }
        });

        const totalReviews = allSitterReviews.length;
        const sumRatings = allSitterReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverage = sumRatings / totalReviews;

        await prisma.sitter.update({
            where: { id: sitterId },
            data: {
                rating: newAverage,
                reviews: totalReviews
            }
        });

        return NextResponse.json({ message: "Review submitted successfully", review }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating review:", error);
        return NextResponse.json({ message: "Failed to create review", error: error.message }, { status: 500 });
    }
}
