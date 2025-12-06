"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, MapPin, Smartphone, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Scan {
    id: string;
    city: string;
    country: string;
    device: string;
    created_at: string;
}

interface LinkStats {
    id: string;
    title: string;
    slug: string;
    destination: string;
    totalScans: number;
    scans: Scan[];
}

export function AnalyticsDashboard({ userId }: { userId: string }) {
    const [links, setLinks] = useState<LinkStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLink, setSelectedLink] = useState<LinkStats | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [userId]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`/api/analytics?userId=${userId}`);
            const data = await res.json();
            if (data.links) {
                setLinks(data.links);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalScans = links.reduce((sum, link) => sum + link.totalScans, 0);

    if (loading) {
        return <div className="text-center py-12">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">Track your QR code scans and performance</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/links">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Links
                    </Link>
                </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalScans}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{links.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Country</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {links.flatMap(l => l.scans).length > 0
                                ? getMostCommon(links.flatMap(l => l.scans).map(s => s.country))
                                : "N/A"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Device</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">
                            {links.flatMap(l => l.scans).length > 0
                                ? getMostCommon(links.flatMap(l => l.scans).map(s => s.device.split('(')[0].trim()))
                                : "N/A"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Links with Scans */}
            <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Links Performance</h3>

                {links.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No links with analytics yet. Create a link with Recruiter Radar enabled.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/dashboard/links">Create Link</Link>
                        </Button>
                    </Card>
                ) : (
                    links.map((link) => (
                        <Card
                            key={link.id}
                            className={`cursor-pointer transition-colors ${selectedLink?.id === link.id ? 'border-primary' : 'hover:border-primary/50'}`}
                            onClick={() => setSelectedLink(selectedLink?.id === link.id ? null : link)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold">{link.title}</h4>
                                        <p className="text-sm text-muted-foreground">/r/{link.slug}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">{link.totalScans}</p>
                                        <p className="text-sm text-muted-foreground">scans</p>
                                    </div>
                                </div>

                                {/* Expanded Scan Details */}
                                {selectedLink?.id === link.id && link.scans.length > 0 && (
                                    <div className="mt-4 pt-4 border-t space-y-3">
                                        <h5 className="text-sm font-semibold">Recent Scans</h5>
                                        {link.scans.slice(0, 5).map((scan) => (
                                            <div key={scan.id} className="flex items-center justify-between text-sm bg-muted/50 rounded p-3">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {scan.city}, {scan.country}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Smartphone className="h-3 w-3" />
                                                        {scan.device}
                                                    </span>
                                                </div>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(scan.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

function getMostCommon(arr: string[]): string {
    if (arr.length === 0) return "N/A";
    const counts: Record<string, number> = {};
    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
}
