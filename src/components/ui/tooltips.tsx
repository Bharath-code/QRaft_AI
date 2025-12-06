"use client";

import { useState, ReactNode } from "react";
import { HelpCircle, X } from "lucide-react";

interface TooltipProps {
    children: ReactNode;
    content: string;
    title?: string;
}

export function InfoTooltip({ children, content, title }: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-flex items-center gap-1">
            {children}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                <HelpCircle className="h-4 w-4" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 z-50 bg-popover border rounded-lg shadow-lg p-3 max-w-[250px] animate-in fade-in slide-in-from-top-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        {title && <p className="font-semibold mb-1 text-sm">{title}</p>}
                        <p className="text-xs text-muted-foreground">{content}</p>
                    </div>
                </>
            )}
        </div>
    );
}

// Quick Start Guide Component
export function QuickStartGuide() {
    const [dismissed, setDismissed] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("qraft_quickstart_dismissed") === "true";
    });

    if (dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem("qraft_quickstart_dismissed", "true");
    };

    return (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-2">🚀 Quick Start Guide</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Enter any URL you want to encode</li>
                        <li>2. Pick an AI art style that matches your brand</li>
                        <li>3. Click Generate and download your masterpiece!</li>
                    </ol>
                    <p className="mt-3 text-sm">
                        <strong>Pro tip:</strong> Enable "Recruiter Radar" to get notified when someone scans your QR!
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

// Feature Lock Badge
export function ProBadge({ className = "" }: { className?: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white ${className}`}>
            PRO
        </span>
    );
}

// Upgrade Prompt Component
export function UpgradePrompt({ feature }: { feature: string }) {
    return (
        <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-lg">🔒</span>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">{feature} is a Pro feature</p>
                    <p className="text-xs text-muted-foreground">Upgrade for unlimited access</p>
                </div>
                <a
                    href="/#pricing"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Upgrade
                </a>
            </div>
        </div>
    );
}
