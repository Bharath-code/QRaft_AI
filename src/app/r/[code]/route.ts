import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { UAParser } from "ua-parser-js";

// Bot detection patterns
const BOT_PATTERNS = /bot|crawler|spider|scraper|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|googlebot|bingbot/i;

function isBot(userAgent: string): boolean {
    return BOT_PATTERNS.test(userAgent);
}

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
    const { code } = params;

    // 1. Fetch Link
    const { data: link, error } = await supabaseAdmin
        .from('links')
        .select('*')
        .eq('slug', code)
        .single();

    if (error || !link || !link.active) {
        return NextResponse.redirect(new URL('/', req.url)); // Fallback to home
    }

    const userAgent = req.headers.get("user-agent") || "";
    const isBotRequest = isBot(userAgent);

    // 2. Bot Filter - Skip analytics and email for bots
    if (isBotRequest) {
        return NextResponse.redirect(link.destination);
    }

    // 3. LinkedIn Deep-Link (for mobile users)
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    if (isMobile && link.destination.includes('linkedin.com/in/')) {
        const username = link.destination.split('/in/')[1]?.split('/')[0];
        if (username) {
            // Try LinkedIn app deep-link first
            return NextResponse.redirect(`linkedin://profile/${username}`);
        }
    }

    // 4. Async Tracking (Fire & Forget)
    (async () => {
        try {
            const ua = new UAParser(userAgent);
            const device = ua.getDevice();
            const os = ua.getOS();

            // IP-based Geo (from Vercel/Cloudflare headers)
            const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
            const country = req.headers.get("x-vercel-ip-country") || "Unknown Country";
            const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

            const deviceInfo = `${device.vendor || ''} ${device.model || ''} (${os.name || 'Unknown OS'})`.trim() || "Desktop/Unknown";

            await supabaseAdmin.from('scans').insert({
                link_id: link.id,
                ip,
                city,
                country,
                device: deviceInfo,
                user_agent: userAgent
            });

            // Trigger Email Alert if Recruiter Radar is enabled
            if (link.track_scans) {
                // Get user email
                const { data: user } = await supabaseAdmin
                    .from('users')
                    .select('email')
                    .eq('id', link.user_id)
                    .single();

                if (user?.email) {
                    // Import dynamically to avoid cold start issues
                    const { sendScanAlert } = await import('@/lib/email');

                    await sendScanAlert({
                        userEmail: user.email,
                        linkTitle: link.title,
                        city,
                        country,
                        device: deviceInfo,
                        scannedAt: new Date()
                    });

                    console.log(`Scan alert sent to ${user.email}`);
                }
            }

        } catch (e) {
            console.error("Tracking failed", e);
        }
    })();

    // 5. Redirect
    return NextResponse.redirect(link.destination);
}
