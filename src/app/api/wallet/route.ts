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
        
        const initialBalance = 1250;
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
        const { amount, type, title } = body;
        const userId = (session.user as any).id;

        const numAmount = parseFloat(amount);
        // Withdrawals and Payments should be negative
        const finalAmount = (type === 'Withdraw' || type === 'Payment') ? -Math.abs(numAmount) : Math.abs(numAmount);

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: finalAmount,
                type: type || 'Deposit',
                title: title || (type === 'Withdraw' ? 'Withdrawal to Bank' : type === 'Payment' ? 'Payment to Sitter' : 'Funds Added to Wallet'),
                status: 'Completed'
            }
        });

        return NextResponse.json(transaction);
    } catch(err) {
        return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
    }
}
