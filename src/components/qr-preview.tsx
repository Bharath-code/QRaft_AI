"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Loader2, FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";

interface QRPreviewProps {
    result: string | null;
    loading: boolean;
    onDownload: () => void; // Default PNG download
    logo: File | null;
    watermark?: boolean;
}

export function QRPreview({ result, loading, onDownload, logo, watermark }: QRPreviewProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (logo) {
            const url = URL.createObjectURL(logo);
            setLogoUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setLogoUrl(null);
        }
    }, [logo]);

    const handleDownloadPDF = () => {
        if (!result) return;
        const pdf = new jsPDF();
        pdf.addImage(result, "PNG", 10, 10, 190, 190);
        pdf.save("qr-code.pdf");
    };

    // A4 sticker sheet with 3x3 grid
    const handleDownloadStickerSheet = () => {
        if (!result) return;
        const pdf = new jsPDF("portrait", "mm", "a4");

        // A4 dimensions: 210 x 297 mm
        // 3x3 grid with margins
        const margin = 10;
        const gap = 5;
        const qrSize = (210 - (2 * margin) - (2 * gap)) / 3; // ~60mm each

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const x = margin + col * (qrSize + gap);
                const y = margin + row * (qrSize + gap);
                pdf.addImage(result, "PNG", x, y, qrSize, qrSize);
            }
        }

        // Add cutting guides (dotted lines)
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineDashPattern([2, 2], 0);

        // Vertical lines
        for (let i = 1; i < 3; i++) {
            const x = margin + i * (qrSize + gap) - gap / 2;
            pdf.line(x, margin, x, margin + 3 * qrSize + 2 * gap);
        }

        // Horizontal lines
        for (let i = 1; i < 3; i++) {
            const y = margin + i * (qrSize + gap) - gap / 2;
            pdf.line(margin, y, margin + 3 * qrSize + 2 * gap, y);
        }

        pdf.save("qr-sticker-sheet.pdf");
    };

    const handleShare = async () => {
        if (!result) return;
        try {
            await navigator.share({
                title: 'Check out my AI QR Code!',
                text: 'Created with QRaft.ai',
                url: result
            });
        } catch (err) {
            console.log('Share API not supported or cancelled', err);
            // Fallback for desktop: copy to clipboard
            navigator.clipboard.writeText(result);
            alert("Image URL copied to clipboard!");
        }
    };

    return (
        <Card className="relative aspect-square w-full max-w-md mx-auto overflow-hidden bg-secondary/30 border-2 border-dashed border-muted-foreground/25 flex items-center justify-center group">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                        <Loader2 className="h-12 w-12 animate-spin text-purple-500 relative z-10" />
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Dreaming up your masterpiece...
                    </p>
                </div>
            ) : result ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full"
                >
                    {/* Generated QR */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={result}
                        alt="Generated QR Code"
                        className="w-full h-full object-cover"
                    />

                    {/* Logo Overlay */}
                    {logoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-[22%] h-[22%] rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logoUrl}
                                    alt="Brand Logo"
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Watermark Overlay */}
                    {watermark && (
                        <div className="absolute bottom-4 right-4 pointer-events-none opacity-80 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full z-20">
                            <p className="text-[10px] font-medium text-white/90">
                                Made with <span className="text-purple-300">QRaft.ai</span>
                            </p>
                        </div>
                    )}

                    <div className="absolute inset-0 z-30 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-white text-black hover:bg-white/90">
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={onDownload}>
                                    <FileIcon className="mr-2 h-4 w-4" /> PNG (High Res)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadPDF}>
                                    <FileIcon className="mr-2 h-4 w-4" /> PDF (Single)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadStickerSheet}>
                                    <FileIcon className="mr-2 h-4 w-4" /> Sticker Sheet (3x3)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            className="text-white border-white/20 hover:bg-white/20"
                            onClick={handleShare}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center p-8 text-muted-foreground">
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                    </div>
                    <p>Select a style and paste your URL to generate art.</p>
                </div>
            )}
        </Card>
    );
}
