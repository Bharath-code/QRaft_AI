"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Sparkles,
    BarChart3,
    Settings,
    Coffee,
    Link2,
    Layers,
    MessageSquare,
    CreditCard,
    ChevronLeft,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNav = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/#generator", icon: Sparkles, label: "Create QR" },
    { href: "/templates", icon: Layers, label: "Templates" },
];

const featureNav = [
    { href: "/dashboard/links", icon: Link2, label: "Smart Links" },
    { href: "/tea", icon: Coffee, label: "Tea Box" },
    { href: "/story-bio", icon: MessageSquare, label: "Story Bio" },
    { href: "/whatsapp", icon: MessageSquare, label: "WhatsApp QR" },
];

const accountNav = [
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/#pricing", icon: CreditCard, label: "Pricing" },
];

interface SidebarProps {
    collapsed?: boolean;
    onCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
    const pathname = usePathname();

    const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href ||
            (href !== "/" && pathname.startsWith(href.split("#")[0]));

        return (
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                    isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
            >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                    <span className="text-sm font-medium truncate">{label}</span>
                )}
            </Link>
        );
    };

    const NavSection = ({ title, items }: { title: string; items: typeof mainNav }) => (
        <div className="space-y-1">
            {!collapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                    {title}
                </p>
            )}
            {items.map((item) => (
                <NavLink key={item.href} {...item} />
            ))}
        </div>
    );

    return (
        <aside className={cn(
            "hidden lg:flex flex-col h-screen bg-card border-r border-border fixed left-0 top-0 z-40 transition-all duration-300",
            collapsed ? "w-[72px]" : "w-[240px]"
        )}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg">QRaft</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="h-8 w-8 mx-auto rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                <NavSection title="Main" items={mainNav} />
                <NavSection title="Features" items={featureNav} />
                <NavSection title="Account" items={accountNav} />
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                    onClick={onCollapse}
                >
                    <ChevronLeft className={cn(
                        "h-4 w-4 transition-transform",
                        collapsed && "rotate-180"
                    )} />
                    {!collapsed && <span className="ml-2">Collapse</span>}
                </Button>
            </div>
        </aside>
    );
}
