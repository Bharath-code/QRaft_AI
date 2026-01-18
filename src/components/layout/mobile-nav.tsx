"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/#generator", icon: Sparkles, label: "Create" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Stats" },
    { href: "/dashboard", icon: User, label: "Account" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t-3 border-foreground safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// MobileMenu component for App Shell
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Menu Content */}
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r-3 border-foreground p-6 animate-in slide-in-from-left">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2"
                    aria-label="Close menu"
                >
                    ✕
                </button>

                <nav className="mt-12 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
