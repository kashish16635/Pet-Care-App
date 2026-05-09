import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const location = searchParams.get("location");

    try {
        const sitters = await prisma.sitter.findMany({
            where: {
                AND: [
                    type && type !== "all" ? (
                        type === "all-in-one" 
                        ? { AND: [{ type: { contains: "Sitter" } }, { type: { contains: "Walker" } }] }
                        : { type: { contains: type === "boarding" ? "Boarding" : type === "walker" ? "Walker" : "Sitter" } }
                    ) : {},
                    location ? {
                        OR: location.split(',').map(part => ({
                            location: {
                                contains: part.trim()
                            }
                        }))
                    } : {}
                ]
            }
        });

        // If no sitters found, return empty array instead of Bandra fallback
        if (sitters.length === 0 && location) {
            return NextResponse.json([]);
        }
        
        // If DB is empty and no search performed, you might still want some default but let's keep it real
        if (sitters.length === 0) {
             return NextResponse.json([]);
        }
        
        return NextResponse.json(sitters);
    } catch (e) {
        console.error("Failed to fetch sitters", e);
        return NextResponse.json({ error: "Failed to load sitters" }, { status: 500 });
    }
}
