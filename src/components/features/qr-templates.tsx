"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Search, Sparkles } from "lucide-react";
import Link from "next/link";

// QR Template categories and items
const TEMPLATES = {
    business: {
        name: "Business",
        icon: "💼",
        items: [
            { id: "linkedin", name: "LinkedIn Profile", urlTemplate: "https://linkedin.com/in/USERNAME", placeholder: "username" },
            { id: "vcard", name: "Contact Card", urlTemplate: "https://vcards.example.com/CONTACTID", placeholder: "contact-id" },
            { id: "website", name: "Company Website", urlTemplate: "https://", placeholder: "your-website.com" },
            { id: "calendar", name: "Book a Meeting", urlTemplate: "https://calendly.com/USERNAME", placeholder: "username" },
        ]
    },
    social: {
        name: "Social Media",
        icon: "📱",
        items: [
            { id: "instagram", name: "Instagram", urlTemplate: "https://instagram.com/USERNAME", placeholder: "username" },
            { id: "twitter", name: "Twitter/X", urlTemplate: "https://x.com/USERNAME", placeholder: "username" },
            { id: "tiktok", name: "TikTok", urlTemplate: "https://tiktok.com/@USERNAME", placeholder: "username" },
            { id: "youtube", name: "YouTube", urlTemplate: "https://youtube.com/@CHANNEL", placeholder: "channel" },
        ]
    },
    payment: {
        name: "Payments",
        icon: "💰",
        items: [
            { id: "paypal", name: "PayPal.me", urlTemplate: "https://paypal.me/USERNAME", placeholder: "username" },
            { id: "venmo", name: "Venmo", urlTemplate: "https://venmo.com/USERNAME", placeholder: "username" },
            { id: "upi", name: "UPI Payment", urlTemplate: "upi://pay?pa=UPIID", placeholder: "yourname@upi" },
            { id: "stripe", name: "Stripe Link", urlTemplate: "https://", placeholder: "buy.stripe.com/..." },
        ]
    },
    content: {
        name: "Content",
        icon: "📄",
        items: [
            { id: "pdf", name: "PDF Document", urlTemplate: "https://", placeholder: "link-to-pdf" },
            { id: "portfolio", name: "Portfolio", urlTemplate: "https://", placeholder: "portfolio-url" },
            { id: "menu", name: "Restaurant Menu", urlTemplate: "https://", placeholder: "menu-url" },
            { id: "feedback", name: "Feedback Form", urlTemplate: "https://forms.google.com/...", placeholder: "form-url" },
        ]
    }
};

export function QRTemplates() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const getFullUrl = () => {
        if (!selectedTemplate || !inputValue) return "";
        return selectedTemplate.urlTemplate.replace(
            selectedTemplate.placeholder.toUpperCase(),
            inputValue
        );
    };

    const handleGenerate = () => {
        const url = getFullUrl();
        if (url) {
            window.location.href = `/#generator?url=${encodeURIComponent(url)}`;
        }
    };

    const allTemplates = Object.entries(TEMPLATES).flatMap(([cat, data]) =>
        data.items.map(item => ({ ...item, category: cat, categoryName: data.name, icon: data.icon }))
    );

    const filteredTemplates = searchQuery
        ? allTemplates.filter(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">QR Templates 📋</h1>
                    <p className="text-muted-foreground text-lg">
                        Quick-start templates for common use cases
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 h-12"
                        placeholder="Search templates (e.g., 'Instagram', 'Payment')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Search Results */}
                {searchQuery && (
                    <div className="grid gap-3 mb-8">
                        {filteredTemplates.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No templates found</p>
                        ) : (
                            filteredTemplates.map((t) => (
                                <Card
                                    key={t.id}
                                    className="cursor-pointer hover:border-primary/50 transition-colors"
                                    onClick={() => {
                                        setSelectedTemplate(t);
                                        setSelectedCategory(t.category);
                                        setSearchQuery("");
                                    }}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <span className="text-2xl">{t.icon}</span>
                                        <div>
                                            <p className="font-medium">{t.name}</p>
                                            <p className="text-sm text-muted-foreground">{t.categoryName}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Categories */}
                {!searchQuery && !selectedTemplate && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(TEMPLATES).map(([key, category]) => (
                            <Card
                                key={key}
                                className="cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="text-2xl">{category.icon}</span>
                                        {category.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {category.items.length} templates
                                    </CardDescription>
                                </CardHeader>

                                {selectedCategory === key && (
                                    <CardContent className="pt-0">
                                        <div className="grid gap-2">
                                            {category.items.map((item) => (
                                                <Button
                                                    key={item.id}
                                                    variant="outline"
                                                    className="justify-start"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTemplate(item);
                                                    }}
                                                >
                                                    {item.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Template Editor */}
                {selectedTemplate && (
                    <Card className="mt-8 border-primary/50">
                        <CardHeader>
                            <Button
                                variant="ghost"
                                className="w-fit mb-2"
                                onClick={() => setSelectedTemplate(null)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
                            </Button>
                            <CardTitle>{selectedTemplate.name}</CardTitle>
                            <CardDescription>
                                Fill in the details to generate your QR code
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Enter your {selectedTemplate.placeholder}
                                </label>
                                <Input
                                    placeholder={selectedTemplate.placeholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="text-lg"
                                />
                            </div>

                            {inputValue && (
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium mb-1">Preview URL:</p>
                                    <code className="text-xs break-all text-primary">
                                        {getFullUrl()}
                                    </code>
                                </div>
                            )}

                            <Button
                                size="lg"
                                className="w-full"
                                onClick={handleGenerate}
                                disabled={!inputValue}
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate QR Code
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
