import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY || "",
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    try {
        // 1. Get Session from Dodo to find User ID
        const session = await client.checkoutSessions.retrieve(sessionId);
        const userId = (session as any).metadata?.userId;

        if (!userId) {
            return NextResponse.json({ error: "Invalid session" }, { status: 404 });
        }

        // 2. Poll Supabase for latest generation for this user
        // We look for a generation created VERY recently (after this session started preferably, but latest is fine for one-time guest flow)
        const { data: generation } = await getSupabaseAdmin()
            .from("generations")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (generation) {
            return NextResponse.json({
                status: "completed",
                imageUrl: generation.image_url,
                generationId: generation.id
            });
        }

        return NextResponse.json({ status: "processing" });

    } catch (error) {
        console.error("Order status check failed:", error);
        return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
    }
}
