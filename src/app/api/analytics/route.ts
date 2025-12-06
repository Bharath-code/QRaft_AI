import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    try {
        // Fetch all links with their scans
        const { data: links, error } = await supabaseAdmin
            .from("links")
            .select(`
                id,
                title,
                slug,
                destination,
                track_scans,
                created_at
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching links:", error);
            return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
        }

        // Fetch scans for all links
        const linkIds = links?.map(l => l.id) || [];

        let scansData: any[] = [];
        if (linkIds.length > 0) {
            const { data: scans } = await supabaseAdmin
                .from("scans")
                .select("*")
                .in("link_id", linkIds)
                .order("created_at", { ascending: false });

            scansData = scans || [];
        }

        // Combine links with their scans
        const linksWithStats = links?.map(link => ({
            ...link,
            totalScans: scansData.filter(s => s.link_id === link.id).length,
            scans: scansData.filter(s => s.link_id === link.id)
        })) || [];

        return NextResponse.json({ links: linksWithStats });

    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
