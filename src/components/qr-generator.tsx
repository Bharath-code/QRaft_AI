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
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!url) return;
        setLoading(true);

        try {
            // Create Checkout Session
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: "p_one_time_qr", // Replace with real Dodo Product ID
                    targetUrl: url,
                    styleId: selectedStyle,
                    userId: "guest"
                }),
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                console.error("No checkout URL returned");
                setLoading(false);
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            setLoading(false);
        }
    };

    return (
        <section className="container px-4 pb-24" id="generator">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-12">
                    {/* Step 1: URL */}
                    <div className="space-y-4 text-center mt-12">
                        <h2 className="text-2xl font-bold font-display">1. Destination</h2>
                        <Input
                            placeholder="https://your-website.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="h-24 text-2xl md:text-4xl bg-background border-3 border-foreground shadow-hard rounded-none text-center placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-hard-lg transition-all"
                        />
                    </div>

                    {/* Step 2: Style */}
                    <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-bold font-display">2. Style</h2>
                        <StyleSelector
                            selectedStyle={selectedStyle}
                            onSelect={setSelectedStyle}
                        />
                    </div>

                    {/* Step 3: Action */}
                    <div className="flex justify-center pt-8">
                        <Button
                            size="lg"
                            className="h-16 px-12 text-xl font-bold font-display uppercase tracking-wide border-3 border-foreground bg-primary text-primary-foreground shadow-hard rounded-none hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-hard-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            onClick={handleCheckout}
                            disabled={!url || loading}
                        >
                            {loading ? (
                                "Redirecting to Payment..."
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-6 w-6" /> Generate Artifact ($2.99)
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Instant Delivery • High-Res PNG & SVG • Scannability Guarantee
                    </p>
                </div>
            </div>
        </section>
    );
}
