"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Generation {
    id: string;
    image_url: string;
    style_id: string;
    created_at: string;
}

export function Gallery() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchGallery = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from('generations')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (data) setGenerations(data);
            setLoading(false);
        };
        fetchGallery();
    }, [supabase]);

    if (loading) return <Loader2 className="animate-spin text-muted-foreground" />;

    if (generations.length === 0) {
        return <div className="text-muted-foreground text-sm">No masterpieces yet. Start creating!</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generations.map((gen) => (
                <Card key={gen.id} className="overflow-hidden group relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={gen.image_url}
                        alt={gen.style_id}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" asChild>
                            <a href={gen.image_url} download={`qr-${gen.id}.png`} target="_blank">
                                <Download className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
