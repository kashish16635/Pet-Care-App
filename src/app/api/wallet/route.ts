import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const userId = (session.user as any).id;
        const transactions = await prisma.transaction.findMany({ 
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        
        const initialBalance = 13250;
        const balance = transactions.reduce((sum: number, tx: any) => sum + tx.amount, initialBalance);

        return NextResponse.json({ balance, transactions });
    } catch(err) {
        return NextResponse.json({ error: "Failed to load wallet data" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { amount, type = 'Deposit', title } = body;
        const userId = (session.user as any).id;

        const finalAmount = type === 'Deposit' ? Math.abs(parseFloat(amount)) : -Math.abs(parseFloat(amount));

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: finalAmount,
                type,
                title: title || (type === 'Deposit' ? 'Funds Added to Wallet' : type === 'Withdrawal' ? 'Withdraw to Bank' : 'Payment to Sitter'),
                status: 'Completed'
            }
        });

        return NextResponse.json(transaction);
    } catch(err) {
        return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const userId = (session.user as any).id;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await prisma.transaction.deleteMany({
            where: { id, userId }
        });

        return NextResponse.json({ success: true });
    } catch(err) {
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
