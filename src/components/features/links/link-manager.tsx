"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link2, Copy, ExternalLink, Trash2, BarChart3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Link {
    id: string;
    slug: string;
    destination: string;
    title: string;
    active: boolean;
    track_scans: boolean;
    created_at: string;
}

export function LinkManager({ userId }: { userId: string }) {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [destination, setDestination] = useState("");
    const [title, setTitle] = useState("");
    const [trackScans, setTrackScans] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchLinks();
    }, [userId]);

    const fetchLinks = async () => {
        try {
            const res = await fetch(`/api/links?userId=${userId}`);
            const data = await res.json();
            if (data.links) {
                setLinks(data.links);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination,
                    userId,
                    title,
                    trackScans,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setLinks([data.link, ...links]);
                setDestination("");
                setTitle("");
                setTrackScans(true);
                setShowCreateForm(false);
            } else {
                alert(data.error || "Failed to create link");
            }
        } catch (error) {
            console.error("Error creating link:", error);
            alert("Failed to create link");
        } finally {
            setCreating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const getShortUrl = (slug: string) => {
        return `${window.location.origin}/r/${slug}`;
    };

    if (loading) {
        return <div className="text-center py-12">Loading links...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Smart Links</h2>
                    <p className="text-muted-foreground">Create trackable shortlinks with analytics</p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Link
                </Button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Create New Link</CardTitle>
                        <CardDescription>
                            Generate a trackable shortlink for any URL
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="destination">Destination URL *</Label>
                                <Input
                                    id="destination"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title (Optional)</Label>
                                <Input
                                    id="title"
                                    placeholder="My LinkedIn Profile"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="track"
                                    checked={trackScans}
                                    onCheckedChange={setTrackScans}
                                />
                                <Label htmlFor="track" className="cursor-pointer">
                                    Enable Recruiter Radar (Get email alerts on scans)
                                </Label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={creating || !destination}>
                                    {creating ? "Creating..." : "Create Link"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Links List */}
            {links.length === 0 ? (
                <Card className="p-12 text-center">
                    <Link2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first smart link to start tracking scans
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Link
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {links.map((link) => (
                        <Card key={link.id} className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold mb-1 truncate">
                                            {link.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <code className="px-2 py-1 bg-muted rounded text-xs">
                                                {getShortUrl(link.slug)}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => copyToClipboard(getShortUrl(link.slug))}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            → {link.destination}
                                        </p>
                                        {link.track_scans && (
                                            <div className="mt-2 inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                                                <BarChart3 className="h-3 w-3" />
                                                Radar Enabled
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(getShortUrl(link.slug), "_blank")}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
