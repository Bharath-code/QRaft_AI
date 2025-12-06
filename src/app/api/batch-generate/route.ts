import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { urls, style, userId, color, customPrompt } = await req.json();

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: "URLs array is required" },
                { status: 400 }
            );
        }

        if (urls.length > 5) {
            return NextResponse.json(
                { error: "Maximum 5 URLs allowed for batch generation" },
                { status: 400 }
            );
        }

        // Check user plan - batch generation is Pro only
        if (userId) {
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('plan')
                .eq('id', userId)
                .single();

            if (!user || (user.plan !== 'pro' && user.plan !== 'lifetime')) {
                return NextResponse.json(
                    {
                        error: "Pro plan required",
                        message: "Batch generation is a Pro feature. Upgrade to continue.",
                        requiresUpgrade: true
                    },
                    { status: 403 }
                );
            }
        }

        // Process URLs with concurrency limit (2 at a time to avoid rate limits)
        const results = [];
        const batchSize = 2;

        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);

            const batchPromises = batch.map(async (url: string) => {
                try {
                    // Call the main generation API
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/generate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            url,
                            style,
                            color,
                            customPrompt,
                            userId
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.image) {
                        return {
                            url,
                            success: true,
                            image: data.image,
                            watermark: data.watermark
                        };
                    } else {
                        return {
                            url,
                            success: false,
                            error: data.error || 'Generation failed'
                        };
                    }
                } catch (error) {
                    return {
                        url,
                        success: false,
                        error: 'Network error'
                    };
                }
            });

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result) => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                } else {
                    results.push({
                        url: 'unknown',
                        success: false,
                        error: result.reason?.message || 'Unknown error'
                    });
                }
            });
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;

        return NextResponse.json({
            success: true,
            results,
            summary: {
                total: urls.length,
                successful: successCount,
                failed: failureCount
            }
        });

    } catch (error) {
        console.error("Batch generation error:", error);
        return NextResponse.json(
            { error: "Failed to process batch generation" },
            { status: 500 }
        );
    }
}
