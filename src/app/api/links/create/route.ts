import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { destination, userId, title } = body;

        if (!destination || !userId) {
            return NextResponse.json({ error: "Missing destination or userId" }, { status: 400 });
        }

        // 0. Ensure user exists (Guest Handling)
        const { error: userError } = await supabaseAdmin.from('users').upsert({
            id: userId,
            email: `guest-${userId.substring(0, 8)}@temp.qraft.ai`,
            plan: 'free'
        }, { onConflict: 'id' });

        if (userError) {
            console.error("User Creation Error", userError);
            return NextResponse.json({ error: "Failed to initialize guest user session" }, { status: 500 });
        }

        const slug = nanoid(7);

        const { data, error } = await supabaseAdmin.from('links').insert({
            user_id: userId,
            slug,
            destination,
            title: title || "QR Scan Link",
            active: true,
            track_scans: true
        }).select().single();

        if (error) {
            console.error("Link Creation Error", error);
            // Check for unique violation on slug, though rare with nanoid(7)
            if (error.code === '23505') {
                return NextResponse.json({ error: "Slug collision. Try again." }, { status: 409 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const shortUrl = `${process.env.NEXT_PUBLIC_URL || 'https://qraft.ai'}/r/${slug}`;

        return NextResponse.json({ shortUrl, slug });

    } catch (e: any) {
        console.error("API Error in /api/links/create:", e);
        return NextResponse.json({ error: "Internal Server Error", details: e.message }, { status: 500 });
    }
}
