import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const { destination, userId, title, trackScans = true } = await req.json();

        if (!destination || !userId) {
            return NextResponse.json(
                { error: "Destination URL and userId are required" },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(destination);
        } catch {
            return NextResponse.json(
                { error: "Invalid destination URL" },
                { status: 400 }
            );
        }

        // Generate unique slug
        const slug = nanoid(8);

        // Create link
        const { data: link, error } = await supabaseAdmin
            .from("links")
            .insert({
                user_id: userId,
                slug,
                destination,
                title: title || `Link to ${new URL(destination).hostname}`,
                active: true,
                track_scans: trackScans,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating link:", error);
            return NextResponse.json(
                { error: "Failed to create link" },
                { status: 500 }
            );
        }

        const shortUrl = `${process.env.NEXT_PUBLIC_URL}/r/${slug}`;

        return NextResponse.json({
            success: true,
            link,
            shortUrl,
            slug,
        });
    } catch (error) {
        console.error("Link creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET - Fetch user's links
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const { data: links, error } = await supabaseAdmin
            .from("links")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching links:", error);
            return NextResponse.json(
                { error: "Failed to fetch links" },
                { status: 500 }
            );
        }

        return NextResponse.json({ links });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
