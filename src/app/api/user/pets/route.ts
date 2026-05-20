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
        const body = await req.json();
        const { name, type, breed, age, diet, medicalNotes, likes, dislikes, image } = body;

        if (!name || !type) {
            return NextResponse.json({ message: "Name and Type are required" }, { status: 400 });
        }

        const pet = await prisma.pet.create({
            data: {
                name,
                type,
                breed,
                age,
                diet,
                medicalNotes,
                likes,
                dislikes,
                image,
                userId: session.user.id
            }
        });

        return NextResponse.json({ message: "Pet added successfully", pet });
    } catch (error) {
        console.error("Add pet error:", error);
        return NextResponse.json({ message: "Failed to add pet", error }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, name, type, breed, age, diet, medicalNotes, likes, dislikes, image } = body;

        if (!id) {
            return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
        }

        const updatedPet = await prisma.pet.update({
            where: { id, userId: session.user.id },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(breed !== undefined && { breed }),
                ...(age !== undefined && { age }),
                ...(diet !== undefined && { diet }),
                ...(medicalNotes !== undefined && { medicalNotes }),
                ...(likes !== undefined && { likes }),
                ...(dislikes !== undefined && { dislikes }),
                ...(image !== undefined && { image })
            }
        });

        return NextResponse.json({ message: "Pet updated successfully", pet: updatedPet });
    } catch (error) {
        console.error("Update pet error:", error);
        return NextResponse.json({ message: "Failed to update pet", error }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
        }

        await prisma.pet.delete({
            where: { id, userId: session.user.id }
        });

        return NextResponse.json({ message: "Pet deleted successfully" });
    } catch (error) {
        console.error("Delete pet error:", error);
        return NextResponse.json({ message: "Failed to delete pet", error }, { status: 500 });
    }
}
