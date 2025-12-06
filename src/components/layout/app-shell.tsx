"use client";

import { useState, ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { MobileNav, MobileMenu } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface AppShellProps {
    children: ReactNode;
    user?: {
        email?: string;
        plan?: string;
        credits?: number;
    } | null;
    hideNav?: boolean;
}

export function AppShell({ children, user, hideNav = false }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (hideNav) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
            )}>
                {/* Top Navbar */}
                <Navbar
                    user={user}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileNav />

            {/* Mobile Menu Drawer */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />
        </div>
    );
}
