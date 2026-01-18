"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const standalone = window.matchMedia("(display-mode: standalone)").matches
            || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        // Detect iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // Listen for beforeinstallprompt (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after a delay if not dismissed before
            const dismissed = localStorage.getItem("pwa-install-dismissed");
            if (!dismissed) {
                setTimeout(() => setShowPrompt(true), 3000);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Show iOS prompt after delay if on iOS Safari and not standalone
        if (ios && !standalone) {
            const dismissed = localStorage.getItem("pwa-install-dismissed");
            if (!dismissed) {
                setTimeout(() => setShowPrompt(true), 5000);
            }
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwa-install-dismissed", "true");
    };

    // Don't show if already installed
    if (isStandalone || !showPrompt) return null;

    return (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="bg-background border-3 border-foreground p-4 shadow-brutal">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold text-xl">Q</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm mb-1">Install QRaft App</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            {isIOS
                                ? "Tap the share button, then 'Add to Home Screen'"
                                : "Get instant access from your home screen!"}
                        </p>

                        {isIOS ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                                <Share className="h-4 w-4 shrink-0" />
                                <span>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></span>
                            </div>
                        ) : (
                            <Button onClick={handleInstall} size="sm" className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Install App
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
