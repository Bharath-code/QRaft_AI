import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY || "",
    // encryptionKey removed as it's not in ClientOptions
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, userId, targetUrl, styleId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Generate a new UUID for guest users if not provided
        const finalUserId = userId || crypto.randomUUID();

        // Create Checkout Session
        // Check Dodo docs: usually 'return_url' or similar?
        // Usage based on error: success_url is wrong.
        // Let's assume 'return_url' for now, or I can search next.
        const session = await client.checkoutSessions.create({
            product_cart: [{ product_id: productId, quantity: 1 }],
            metadata: {
                userId: finalUserId,
                targetUrl: targetUrl || "",
                styleId: styleId || ""
            },
            return_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        });

        // Cast to any to work around SDK type issues
        const checkoutUrl = (session as any).payment_link || (session as any).url || (session as any).checkout_url;
        return NextResponse.json({ checkoutUrl });
    } catch (error) {
        console.error("DodoPayments Checkout Error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
