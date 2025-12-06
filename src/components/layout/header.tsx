"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/#generator", label: "Create" },
    { href: "/templates", label: "Templates" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b-3 border-foreground">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold">Q</span>
                            </div>
                            <span>QRaft</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="brutalist-link font-medium text-sm uppercase tracking-wide"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="hidden md:block">
                            <Link
                                href="/login"
                                className="brutalist-btn text-sm"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 border-2 border-foreground"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-background pt-16 md:hidden">
                    <nav className="container mx-auto px-4 py-8">
                        <div className="space-y-6">
                            {navItems.map((item, i) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block font-display text-4xl font-bold reveal-up reveal-up-${i + 1}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 reveal-up reveal-up-5">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="brutalist-btn inline-block text-lg"
                            >
                                Get Started →
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
