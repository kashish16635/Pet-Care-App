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
                        location: {
                            contains: location.split(',')[0].trim(),
                            mode: 'insensitive'
                        }
                    } : {}
                ]
            }
        });

        // Removed confusing global fallback. If filters yield 0 results, we return an empty array.

        
        return NextResponse.json(sitters);
    } catch (e) {
        console.error("Failed to fetch sitters", e);
        // LAST RESORT FALLBACK: If DB query fails or something else goes wrong, try a simple fetch
        try {
            const fallback = await prisma.sitter.findMany({ take: 6 });
            return NextResponse.json(fallback);
        } catch (inner) {
            return NextResponse.json({ error: "Database connection issue" }, { status: 500 });
        }
    }
}
