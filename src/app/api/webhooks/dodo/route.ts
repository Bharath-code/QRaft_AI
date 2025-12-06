import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("x-dodo-signature");

        // TODO: Verify webhook signature for production
        // const isValid = verifyDodoSignature(body, signature, process.env.DODO_WEBHOOK_SECRET);
        // if (!isValid) {
        //     return new Response("Invalid signature", { status: 401 });
        // }

        const event = JSON.parse(body);
        console.log("Webhook received:", event.type);

        // Handle different event types
        if (event.type === "payment.succeeded" || event.type === "payment.completed" || event.type === "checkout.completed") {
            const { metadata, product_id } = event.data;
            const userId = metadata?.userId;

            if (!userId) {
                console.error("No userId in webhook metadata");
                return new Response("No userId", { status: 400 });
            }

            // Determine what was purchased based on product_id
            let updates: any = {};

            // Pro Plans
            if (product_id?.includes("pro_monthly") || product_id?.includes("pro_yearly")) {
                updates.plan = "pro";
                console.log(`Upgrading user ${userId} to Pro plan`);
            }
            // Lifetime Plan
            else if (product_id?.includes("lifetime")) {
                updates.plan = "lifetime";
                console.log(`Upgrading user ${userId} to Lifetime plan`);
            }
            // Credit Packs
            else if (product_id?.includes("single")) {
                // Get current credits and add 1
                const { data: currentUser } = await supabaseAdmin
                    .from("users")
                    .select("credits")
                    .eq("id", userId)
                    .single();

                updates.credits = (currentUser?.credits || 0) + 1;
                console.log(`Adding 1 credit to user ${userId}`);
            } else if (product_id?.includes("career_pack")) {
                // Get current credits and add 5
                const { data: currentUser } = await supabaseAdmin
                    .from("users")
                    .select("credits")
                    .eq("id", userId)
                    .single();

                updates.credits = (currentUser?.credits || 0) + 5;
                console.log(`Adding 5 credits to user ${userId}`);
            }

            // Update user in database
            const { error } = await supabaseAdmin
                .from("users")
                .update(updates)
                .eq("id", userId);

            if (error) {
                console.error("Error updating user:", error);
                return new Response("Database error", { status: 500 });
            }

            console.log(`Successfully updated user ${userId}:`, updates);
        }

        // Handle subscription activation
        else if (event.type === "subscription.active") {
            const { metadata } = event.data;
            const userId = metadata?.userId;

            if (userId) {
                await supabaseAdmin
                    .from("users")
                    .update({ plan: "pro" })
                    .eq("id", userId);

                console.log(`Activated Pro subscription for user ${userId}`);
            }
        }

        // Handle subscription cancellation
        else if (event.type === "subscription.cancelled") {
            const { metadata } = event.data;
            const userId = metadata?.userId;

            if (userId) {
                await supabaseAdmin
                    .from("users")
                    .update({ plan: "free" })
                    .eq("id", userId);

                console.log(`Downgraded user ${userId} to free plan`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
