"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
    {
        id: "student",
        name: "Student Vibes 🎓",
        template: "Hey! I'm {name}, studying {field} at {school}. {fact}. Connect with me! 🔗"
    },
    {
        id: "creative",
        name: "Creative Soul 🎨",
        template: "{greeting}! I'm {name} - {role}. {passion}. Let's create something amazing! ✨"
    },
    {
        id: "professional",
        name: "Career Mode 💼",
        template: "{name} | {title} at {company}. {expertise}. Open to opportunities! 📧"
    },
    {
        id: "mystery",
        name: "Mystery Mode 🌙",
        template: "You found my secret link! 👀 I'm {name}. {mystery}. What's your story?"
    },
    {
        id: "minimal",
        name: "Keep It Simple 📍",
        template: "{name} • {tagline}"
    }
];

export function StoryModeBio() {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fields, setFields] = useState<Record<string, string>>({});
    const [generatedBio, setGeneratedBio] = useState("");

    // Extract field names from template
    const extractFields = (template: string) => {
        const matches = template.match(/\{(\w+)\}/g) || [];
        return matches.map(m => m.slice(1, -1));
    };

    const handleTemplateChange = (template: typeof TEMPLATES[0]) => {
        setSelectedTemplate(template);
        setFields({});
        setGeneratedBio("");
    };

    const handleFieldChange = (field: string, value: string) => {
        const newFields = { ...fields, [field]: value };
        setFields(newFields);

        // Generate bio in real-time
        let bio = selectedTemplate.template;
        Object.entries(newFields).forEach(([key, val]) => {
            bio = bio.replace(`{${key}}`, val || `{${key}}`);
        });
        setGeneratedBio(bio);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedBio);
        alert("Bio copied to clipboard!");
    };

    const fieldLabels: Record<string, string> = {
        name: "Your Name",
        field: "Field of Study",
        school: "School/University",
        fact: "Fun Fact About You",
        greeting: "Your Greeting (e.g., 'Heyyy', 'Yo', 'Welcome')",
        role: "What You Do",
        passion: "Your Passion",
        title: "Job Title",
        company: "Company",
        expertise: "Your Expertise",
        mystery: "Something Mysterious",
        tagline: "Your Tagline"
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container max-w-3xl mx-auto">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>

                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">Story Mode Bio ✨</CardTitle>
                        <CardDescription className="text-base">
                            Create the perfect Instagram/Twitter bio in seconds. Pick a vibe, fill in the blanks!
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Template Selection */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">1. Choose Your Vibe</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {TEMPLATES.map((t) => (
                                    <Button
                                        key={t.id}
                                        variant={selectedTemplate.id === t.id ? "default" : "outline"}
                                        className="h-auto py-3 px-4 text-left justify-start"
                                        onClick={() => handleTemplateChange(t)}
                                    >
                                        {t.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">2. Fill in the Blanks</Label>
                            <div className="grid gap-4">
                                {extractFields(selectedTemplate.template).map((field) => (
                                    <div key={field} className="space-y-2">
                                        <Label htmlFor={field} className="capitalize">
                                            {fieldLabels[field] || field}
                                        </Label>
                                        <Input
                                            id={field}
                                            placeholder={`Enter your ${field}...`}
                                            value={fields[field] || ""}
                                            onChange={(e) => handleFieldChange(field, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">3. Your Bio Preview</Label>
                            <div className="relative">
                                <Textarea
                                    value={generatedBio || selectedTemplate.template}
                                    readOnly
                                    className="min-h-[100px] text-lg bg-muted/50 resize-none"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={copyToClipboard}
                                        disabled={!generatedBio}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                {generatedBio.length || 0} characters
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={copyToClipboard}
                                disabled={!generatedBio}
                            >
                                <Copy className="mr-2 h-4 w-4" /> Copy Bio
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1"
                                asChild
                            >
                                <Link href="/#generator">
                                    Generate QR for Bio <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Tips */}
                        <div className="pt-6 border-t">
                            <h3 className="font-semibold mb-3">💡 Bio Tips:</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Keep it under 150 characters for Instagram</li>
                                <li>• Use emojis to add personality</li>
                                <li>• Include a call-to-action (CTA)</li>
                                <li>• Make it memorable and unique</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
