import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const location = searchParams.get("location");

    try {
        let sitters = await prisma.sitter.findMany({
            where: {
                AND: [
                    type && type !== "all" ? (
                        type === "all-in-one" 
                        ? { OR: [{ type: { contains: "Sitter", mode: 'insensitive' } }, { type: { contains: "Walker", mode: 'insensitive' } }] }
                        : { type: { contains: type === "boarding" ? "Boarding" : type === "walker" ? "Walker" : "Sitter", mode: 'insensitive' } }
                    ) : {},
                    location ? {
                        OR: location.split(',').map(part => ({
                            location: {
                                contains: part.trim(),
                                mode: 'insensitive'
                            }
                        }))
                    } : {}
                ]
            }
        });

        // FALLBACK FOR PRESENTATION: If no specific location matches, show featured sitters
        if (sitters.length === 0 && location) {
            sitters = await prisma.sitter.findMany({
                take: 6,
                orderBy: { rating: 'desc' }
            });
        }
        
        return NextResponse.json(sitters);
    } catch (e) {
        console.error("Failed to fetch sitters", e);
        return NextResponse.json({ error: "Failed to load sitters" }, { status: 500 });
    }
}
