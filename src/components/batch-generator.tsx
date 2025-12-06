"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { StyleSelector, STYLES } from "./style-selector";

export function BatchGenerator() {
    const [urls, setUrls] = useState<string[]>([""]);
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const [loading, setLoading] = useState(false);

    const addUrl = () => {
        if (urls.length < 5) {
            setUrls([...urls, ""]);
        }
    };

    const removeUrl = (index: number) => {
        const newUrls = [...urls];
        newUrls.splice(index, 1);
        setUrls(newUrls);
    };

    const updateUrl = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleBatchGenerate = async () => {
        const validUrls = urls.filter(u => u.trim());

        if (validUrls.length === 0) {
            alert("Please enter at least one URL");
            return;
        }

        setLoading(true);

        try {
            // Get userId from localStorage
            const userId = localStorage.getItem("qraft_user_id");

            const response = await fetch("/api/batch-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    urls: validUrls,
                    style: selectedStyle,
                    userId
                })
            });

            const data = await response.json();

            if (response.status === 403) {
                alert(data.message || "Pro plan required for batch generation");
                window.location.href = "/#pricing";
                return;
            }

            if (data.success) {
                const { summary, results } = data;
                alert(`Batch generation complete!\n\nSuccessful: ${summary.successful}\nFailed: ${summary.failed}\n\nCheck your dashboard to view the generated QR codes.`);

                // Redirect to dashboard
                window.location.href = "/dashboard";
            } else {
                alert(data.error || "Batch generation failed");
            }
        } catch (error) {
            console.error("Batch generation error:", error);
            alert("Failed to generate batch. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Batch Generation (Pro)</h2>
                <p className="text-muted-foreground">Create up to 5 QR codes at once.</p>
            </div>

            <div className="space-y-4">
                {urls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                        <Input
                            placeholder={`URL #${i + 1}`}
                            value={url}
                            onChange={(e) => updateUrl(i, e.target.value)}
                        />
                        {urls.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeUrl(i)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        )}
                    </div>
                ))}

                {urls.length < 5 && (
                    <Button variant="outline" onClick={addUrl} className="w-full border-dashed">
                        <Plus className="mr-2 h-4 w-4" /> Add another URL
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">Select Style for All</h3>
                {/* Simplified style selector for batch */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {STYLES.map((style) => (
                        <div
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`cursor-pointer rounded-md p-2 text-xs text-center border ${selectedStyle === style.id ? "border-primary bg-primary/10" : "border-transparent hover:bg-secondary"
                                }`}
                        >
                            {style.name}
                        </div>
                    ))}
                </div>
            </div>

            <Button
                size="lg"
                className="w-full"
                onClick={handleBatchGenerate}
                disabled={loading}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate {urls.filter(u => u).length} QR Codes
            </Button>
        </div>
    );
}
