import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CreditCard, TrendingUp, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Gallery } from "@/components/gallery";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch user profile
    let profile = null;
    const { data: existingProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (!existingProfile) {
        const { data: newProfile } = await supabase
            .from("users")
            .insert({
                id: session.user.id,
                email: session.user.email,
                plan: "free",
                credits: 0,
            })
            .select()
            .single();
        profile = newProfile;
    } else {
        profile = existingProfile;
    }

    return (
        <div className="min-h-screen bg-background bg-noise">
            <Header />

            <main className="pt-24 pb-24 md:pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">
                                Welcome back, {session.user.email?.split('@')[0]}
                            </p>
                        </div>
                        <Link href="/#generator" className="brutalist-btn inline-flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" /> Create QR
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        {/* Plan Card */}
                        <div className="brutalist-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Plan</span>
                                <div className="w-10 h-10 bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold">
                                        {(profile?.plan || 'free')[0].toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <p className="font-display text-2xl font-bold capitalize mb-1">
                                {profile?.plan || 'Free'}
                            </p>
                            {profile?.plan === 'free' && (
                                <Link href="/#pricing" className="text-sm text-primary font-bold inline-flex items-center gap-1">
                                    Upgrade <ArrowRight className="h-3 w-3" />
                                </Link>
                            )}
                        </div>

                        {/* Credits Card */}
                        <div className="brutalist-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Credits</span>
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="font-display text-2xl font-bold mb-1">
                                {profile?.credits || 0}
                            </p>
                            <Link href="/#pricing" className="text-sm text-primary font-bold inline-flex items-center gap-1">
                                Buy More <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {/* Analytics Card */}
                        <div className="brutalist-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Scans</span>
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="font-display text-2xl font-bold mb-1">--</p>
                            <Link href="/dashboard/analytics" className="text-sm text-primary font-bold inline-flex items-center gap-1">
                                View Stats <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                        <QuickLink href="/dashboard/links" label="Smart Links" />
                        <QuickLink href="/dashboard/tea" label="Tea Inbox" />
                        <QuickLink href="/templates" label="Templates" />
                        <QuickLink href="/story-bio" label="Story Bio" />
                    </div>

                    {/* Gallery */}
                    <div>
                        <h2 className="font-display text-xl font-bold mb-4">Your QR Codes</h2>
                        <Gallery />
                    </div>
                </div>
            </main>

            <MobileNav />
        </div>
    );
}

function QuickLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="p-4 border-3 border-foreground bg-card text-center font-bold uppercase text-sm tracking-wide hover:bg-muted transition-colors"
        >
            {label}
        </Link>
    );
}
