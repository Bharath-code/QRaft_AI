"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, Bell, User, CreditCard, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
    user?: {
        email?: string;
        plan?: string;
        credits?: number;
    } | null;
    onMenuClick?: () => void;
}

export function Navbar({ user, onMenuClick }: NavbarProps) {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="h-16 flex items-center justify-between px-4 lg:px-6">
                {/* Left side - Mobile menu + Logo (mobile only) */}
                <div className="flex items-center gap-3 lg:hidden">
                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Q</span>
                        </div>
                        <span className="font-bold">QRaft</span>
                    </Link>
                </div>

                {/* Center - Search (desktop) */}
                <div className="hidden lg:flex flex-1 max-w-md mx-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search features, templates..."
                            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
                        />
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Search toggle (mobile) */}
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(!searchOpen)}>
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Credits badge */}
                    {user && (
                        <Link href="/#pricing">
                            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                                <CreditCard className="h-4 w-4" />
                                <span>{user.credits || 0} credits</span>
                            </Button>
                        </Link>
                    )}

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full" />
                    </Button>

                    {/* User menu */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <p className="font-medium">{user.email}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user.plan || 'Free'} Plan</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">
                                        <User className="mr-2 h-4 w-4" /> Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/analytics">
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild size="sm">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile search bar (expandable) */}
            {searchOpen && (
                <div className="px-4 pb-3 lg:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
