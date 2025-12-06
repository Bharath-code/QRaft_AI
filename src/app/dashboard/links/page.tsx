import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LinkManager } from "@/components/features/links/link-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function LinksPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container py-12 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <LinkManager userId={session.user.id} />
        </div>
    );
}
