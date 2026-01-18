// ... imports
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const STYLE_PROMPTS: Record<string, string> = {
    cyberpunk: "cyberpunk neon city, rain, holographic, futuristic, purple and pink glow, high contrast, glossy, digital art",
    luxury: "golden ornate frame, marble texture, luxury, elegant, 24k gold, premium design, rich lighting",
    sakura: "japanese watercolor, cherry blossoms, pink, washi paper, soft lighting, ethereal, lo-fi aesthetic",
    vaporwave: "vaporwave aesthetic, palm trees, sunset grid, 80s retro, neon pink and cyan, synthwave, chrome, glitch art",
    banksy: "banksy street art, stencil style, brick wall, graffiti, urban, black and white with red accent, rebellious",
    floral: "victorian floral pattern, intricate vines, roses, antique parchment, botanical illustration, cottagecore",
    isometric: "3d isometric tiny world, pastel colors, floating island, miniature buildings, soft shadows, cozy games vibe",
    swiss: "swiss design, bold geometry, bauhaus, minimal, red accent, clean lines, typography, poster art",
    abstract: "fluid colors, oil spill, modern art, vibrant, swirling pattern, acid graphics, trippy, y2k aesthetic",
    paper: "layered paper cuts, depth, origami, shadowbox style, craft, handmade feel"
};

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        // const signature = headersList.get("x-dodo-signature");
        // TODO: Verify signature

        const event = JSON.parse(body);
        console.log("Webhook received:", event.type);

        if (event.type === "payment.succeeded" || event.type === "payment.completed" || event.type === "checkout.completed") {
            const { metadata, product_id } = event.data;
            const userId = metadata?.userId;

            if (!userId) {
                console.error("No userId in webhook metadata");
                return new Response("No userId", { status: 400 });
            }

            // Ensure user exists (Guest Handling)
            const { data: user } = await getSupabaseAdmin().from('users').select('id').eq('id', userId).single();
            if (!user) {
                await getSupabaseAdmin().from('users').insert({
                    id: userId,
                    email: `${userId}@anon.com`,
                    plan: 'free', // One-time users are technically free/guest
                    credits: 0
                });
            }

            // Handle One-Time QR Generation
            if (metadata?.targetUrl && metadata?.styleId) {
                console.log(`Generating QR for ${userId} (${metadata.styleId})`);

                const style = metadata.styleId;
                const url = metadata.targetUrl;
                let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.cyberpunk;

                // Replicate Generation
                const output = await replicate.run(
                    "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238571c2",
                    {
                        input: {
                            url: url,
                            prompt: `${prompt}, QR code art, high quality, detailed, 4k, scannable`,
                            qr_code_content: url,
                            negative_prompt: "ugly, blurry, low quality, distorted, text, watermark",
                            guidance_scale: 7.5,
                            controlnet_conditioning_scale: 1.5,
                            num_inference_steps: 40,
                            seed: Math.floor(Math.random() * 1000000),
                        },
                    }
                );

                const imageUrl = Array.isArray(output) ? output[0] : output;

                if (imageUrl) {
                    await getSupabaseAdmin().from('generations').insert({
                        user_id: userId,
                        image_url: imageUrl,
                        style_id: style,
                        prompt: prompt
                    });
                    console.log(`Generation saved for ${userId}`);
                }
            }
            // Handle Pro/Credits (Existing Logic)
            else if (product_id?.includes("pro_monthly") || product_id?.includes("pro_yearly")) {
                // ... existing pro logic if needed, or remove if unused in MVP pivot check
                // I will keep generic structure but focus on the QR part above.
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
