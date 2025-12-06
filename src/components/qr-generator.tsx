"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, ChevronDown, ChevronUp } from "lucide-react";
import { StyleSelector, STYLES } from "./style-selector";
import { QRPreview } from "./qr-preview";
import { LogoUploader } from "./logo-uploader";
import { ColorPicker } from "./color-picker";
import { UpgradeModal } from "./upgrade-modal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function QRGenerator() {
    const [url, setUrl] = useState("");
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const [selectedColor, setSelectedColor] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [hasWatermark, setHasWatermark] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [enableRadar, setEnableRadar] = useState(false);

    useEffect(() => {
        let id = localStorage.getItem("qraft_user_id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("qraft_user_id", id);
        }
        setUserId(id);
    }, []);

    const handleGenerate = async () => {
        if (!url) return;

        setLoading(true);
        setResult(null);

        try {
            let finalUrl = url;

            // 1. If Radar enabled, create shortlink first
            if (enableRadar) {
                const linkRes = await fetch("/api/links/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        destination: url,
                        userId,
                        title: `Scan: ${url.substring(0, 20)}...`
                    })
                });

                if (linkRes.ok) {
                    const linkData = await linkRes.json();
                    finalUrl = linkData.shortUrl;
                    console.log("Radar Logic: Using shortlink", finalUrl);
                } else {
                    console.error("Failed to create radar link");
                    // Continue with original URL, or alert user?
                    // For MVP, likely better to fail gracefully => use original URL
                }
            }

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: finalUrl,
                    style: selectedStyle,
                    color: selectedColor,
                    customPrompt,
                    userId
                }),
            });

            if (response.status === 402) {
                setShowUpgradeModal(true);
                setLoading(false);
                return;
            }

            const data = await response.json();
            if (data.image) {
                setResult(data.image);
                setHasWatermark(data.watermark);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const link = document.createElement("a");
        link.href = result;
        link.download = `qr-art-${selectedStyle}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="container px-4 pb-24" id="generator">
            <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />

            <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Controls */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">1. Enter your destination</h2>
                            <Input
                                placeholder="https://your-website.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="h-14 text-lg bg-secondary/30 border-white/10"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">2. Choose your vibe</h2>
                            <StyleSelector
                                selectedStyle={selectedStyle}
                                onSelect={setSelectedStyle}
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">3. Customize (Optional)</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <ColorPicker
                                    selectedColor={selectedColor}
                                    onColorSelect={setSelectedColor}
                                />
                                <LogoUploader
                                    onLogoSelect={setLogo}
                                />
                            </div>

                            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="border rounded-lg p-4 bg-secondary/10">
                                <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-sm">
                                    Advanced Options
                                    {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 space-y-4">
                                    <div className="flex items-center space-x-3 p-3 rounded-md bg-secondary/20">
                                        <Switch id="radar" checked={enableRadar} onCheckedChange={setEnableRadar} />
                                        <Label htmlFor="radar" className="flex flex-col cursor-pointer">
                                            <span className="font-semibold">Enable "Recruiter Radar" 📡</span>
                                            <span className="font-normal text-xs text-muted-foreground">Get notified when someone scans your QR (Redirects via qraft.ai)</span>
                                        </Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Custom Prompt Additions</Label>
                                        <Textarea
                                            placeholder="Add specific details (e.g., 'cyberpunk city with blue neon lights')"
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            className="text-sm bg-background/50"
                                        />
                                        <p className="text-xs text-muted-foreground">This text will be appended to the style prompt.</p>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
                            onClick={handleGenerate}
                            disabled={!url || loading}
                        >
                            {loading ? (
                                "Creating Magic..."
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-5 w-5" /> Generate Masterpiece
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="lg:sticky lg:top-24">
                        <h2 className="text-2xl font-bold mb-4 lg:hidden">4. Your Result</h2>
                        <QRPreview
                            result={result}
                            loading={loading}
                            onDownload={handleDownload}
                            logo={logo}
                            watermark={hasWatermark}
                        />

                        {/* Trust Indicators */}
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
                            <div className="p-4 rounded-lg bg-secondary/20">
                                <p className="font-semibold text-foreground">100%</p>
                                <p>Scannable</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/20">
                                <p className="font-semibold text-foreground">HQ</p>
                                <p>High Res</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/20">
                                <p className="font-semibold text-foreground">0.5s</p>
                                <p>Fast Scan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
