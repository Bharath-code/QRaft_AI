import { NextResponse } from "next/server";
import Replicate from "replicate";
import { supabaseAdmin } from "@/lib/supabase";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Style definition map with optimized prompts
const STYLE_PROMPTS: Record<string, string> = {
    cyberpunk: "cyberpunk neon city, rain, holographic, futuristic, purple and pink glow, high contrast",
    luxury: "golden ornate frame, marble texture, luxury, elegant, 24k gold, premium design",
    sakura: "japanese watercolor, cherry blossoms, pink, washi paper, soft lighting, ethereal",
    vaporwave: "vaporwave aesthetic, palm trees, sunset grid, 80s retro, neon pink and cyan, synthwave",
    banksy: "banksy street art, stencil style, brick wall, graffiti, urban, black and white with red accent",
    floral: "victorian floral pattern, intricate vines, roses, antique parchment, botanical illustration",
    isometric: "3d isometric tiny world, pastel colors, floating island, miniature buildings, soft shadows",
    swiss: "swiss design, bold geometry, bauhaus, minimal, red accent, clean lines, typography",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, style, color, userId, customPrompt } = body;

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        let shouldWatermark = true;

        if (userId) {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (!user && !error) {
                await supabaseAdmin.from('users').insert({ id: userId, email: `${userId}@anon.com` });
            }

            if (user) {
                // 1. Check Pro/Lifetime Plan - Unlimited generations
                if (user.plan === 'pro' || user.plan === 'lifetime') {
                    shouldWatermark = false;
                }
                // 2. Check Credits - Pay-per-use
                else if (user.credits > 0) {
                    shouldWatermark = false;
                    await supabaseAdmin.from('users').update({ credits: user.credits - 1 }).eq('id', userId);
                }
                // 3. No free tier - must pay
                else {
                    return NextResponse.json(
                        {
                            error: "Payment required",
                            message: "Purchase credits or upgrade to Pro to generate QR codes.",
                            requiresPayment: true
                        },
                        { status: 402 }
                    );
                }
            }
        }

        // Validate style or default to cyberpunk
        let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.cyberpunk;

        // Incorporate brand color if provided
        if (color) {
            prompt = `${prompt}, dominant color ${color}, ${color} theme`;
        }

        // Append Custom Prompt
        if (customPrompt) {
            prompt = `${prompt}, ${customPrompt}`;
        }

        // Call Replicate API with zylim0702/qr_code_controlnet
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

        // Replicate returns an array of output URLs
        const imageUrl = Array.isArray(output) ? output[0] : output;

        // SAVE TO HISTORY
        if (userId && imageUrl) {
            await supabaseAdmin.from('generations').insert({
                user_id: userId,
                image_url: imageUrl,
                style_id: style,
                prompt: prompt
            });
        }

        return NextResponse.json({
            success: true,
            image: imageUrl,
            message: `Generated ${style} QR code for ${url}`,
            watermark: shouldWatermark
        });
    } catch (error) {
        console.error("Replicate generation failed:", error);
        return NextResponse.json(
            { error: "Failed to generate QR code" },
            { status: 500 }
        );
    }
}
