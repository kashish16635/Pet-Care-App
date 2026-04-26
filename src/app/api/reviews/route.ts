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
        const { bookingId, sitterId, rating, comment } = body;

        if (!bookingId || !sitterId || rating === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if booking belongs to user and is completed
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        if (booking.userId !== session.user.id) {
            return NextResponse.json({ message: "Not authorized to review this booking" }, { status: 403 });
        }

        if (booking.status !== "Completed") {
            return NextResponse.json({ message: "Can only review completed bookings" }, { status: 400 });
        }

        // Check if review already exists
        const existingReview = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (existingReview) {
            return NextResponse.json({ message: "Review already exists for this booking" }, { status: 400 });
        }

        // Create the review and update Sitter rating in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const newReview = await tx.review.create({
                data: {
                    rating,
                    comment,
                    userId: session.user.id,
                    sitterId,
                    bookingId
                }
            });

            // Get current sitter stats
            const sitter = await tx.sitter.findUnique({
                where: { id: sitterId }
            });

            if (sitter) {
                const currentRating = sitter.rating || 0;
                const currentReviewsCount = sitter.reviews || 0;
                
                const newReviewsCount = currentReviewsCount + 1;
                const newAverageRating = ((currentRating * currentReviewsCount) + rating) / newReviewsCount;

                await tx.sitter.update({
                    where: { id: sitterId },
                    data: {
                        rating: parseFloat(newAverageRating.toFixed(1)),
                        reviews: newReviewsCount
                    }
                });
            }

            return newReview;
        });

        return NextResponse.json({ message: "Review created successfully", review: result }, { status: 201 });
    } catch (error: any) {
        console.error("Review error:", error);
        return NextResponse.json({ message: "Failed to create review", error: error.message }, { status: 500 });
    }
}
