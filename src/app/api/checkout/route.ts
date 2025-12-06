import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY || "", // Ensure you set this in .env
    encryptionKey: process.env.DODO_PAYMENTS_ENCRYPTION_KEY // Optional if needed for webhooks later
});

export async function POST(req: Request) {
    try {
        const { productId, userId, countryCode } = await req.json();

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Create Checkout Session
        const session = await client.checkoutSessions.create({
            product_cart: [{ product_id: productId, quantity: 1 }],
            metadata: {
                userId: userId || "guest",
                country: countryCode || "unknown"
            },
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
        });

        return NextResponse.json({ checkoutUrl: session.url });
    } catch (error) {
        console.error("DodoPayments Checkout Error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
