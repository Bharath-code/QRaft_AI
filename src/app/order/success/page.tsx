"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Loader2, Download, Printer, Save } from "lucide-react";
import jsPDF from "jspdf";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"loading" | "processing" | "completed" | "error">("loading");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generationId, setGenerationId] = useState<string | null>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/order/status?session_id=${sessionId}`);
                const data = await res.json();

                if (data.status === "completed" && data.imageUrl) {
                    setImageUrl(data.imageUrl);
                    setGenerationId(data.generationId);
                    setStatus("completed");
                    if (pollInterval.current) clearInterval(pollInterval.current);
                } else if (data.error) {
                    setStatus("error");
                    if (pollInterval.current) clearInterval(pollInterval.current);
                } else {
                    setStatus("processing");
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        };

        checkStatus();
        pollInterval.current = setInterval(checkStatus, 3000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [sessionId]);

    const handleDownload = async () => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `qraft-qr-${generationId || "art"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Download failed", e);
        }
    };

    const handlePrintA4 = async () => {
        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result as string;

                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });

                const marginX = 10;
                const marginY = 10;
                const qrSize = 80;
                const gap = 15;

                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 2; col++) {
                        const x = marginX + (col * (qrSize + gap));
                        const y = marginY + (row * (qrSize + 5));
                        doc.addImage(base64data, "PNG", x, y, qrSize, qrSize);
                        doc.setDrawColor(200, 200, 200);
                        doc.rect(x, y, qrSize, qrSize);
                    }
                }

                doc.save("qraft-stickers-a4.pdf");
            };
        } catch (e) {
            console.error("PDF generation failed", e);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
            {status === "error" && (
                <div className="text-red-500">
                    <h1 className="text-3xl font-display font-bold mb-4">Something went wrong</h1>
                    <p>We couldn't find your order. Please contact support if you paid.</p>
                </div>
            )}

            {(status === "loading" || status === "processing") && (
                <div className="flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2">Creating your Masterpiece...</h1>
                        <p className="text-muted-foreground animate-pulse">
                            AI is painting your QR code. This usually takes 10-20 seconds. <br />
                            Please do not close this tab.
                        </p>
                    </div>
                </div>
            )}

            {status === "completed" && imageUrl && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <h1 className="text-3xl md:text-5xl font-display font-bold">Your Art is Ready! 🎨</h1>

                    <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-2xl rotate-1 mx-auto max-w-sm">
                            <img src={imageUrl} alt="Generated QR" className="w-full h-auto rounded-md" />
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto text-left">
                            <div className="p-6 bg-secondary/10 rounded-xl border-2 border-primary/20 space-y-4">
                                <h3 className="font-bold text-xl">Next Steps</h3>

                                <Button onClick={handleDownload} className="w-full justify-start h-12 text-lg" variant="default">
                                    <Download className="mr-2 h-5 w-5" /> Download PNG
                                </Button>

                                <Button onClick={handlePrintA4} className="w-full justify-start h-12 text-lg" variant="outline">
                                    <Printer className="mr-2 h-5 w-5" /> Print A4 Sheet (8x)
                                </Button>

                                <div className="h-px bg-border my-4" />

                                <p className="text-xs text-muted-foreground">
                                    Want to save this forever?
                                </p>
                                <Button className="w-full justify-start h-12 text-lg bg-green-600 hover:bg-green-700 text-white">
                                    <Save className="mr-2 h-5 w-5" /> Create Account to Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-background bg-noise">
            <Header />
            <Suspense fallback={
                <div className="container mx-auto px-4 pt-32 pb-16 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-4">Loading...</p>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}

