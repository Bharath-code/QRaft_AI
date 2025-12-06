"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function WhatsAppGenerator() {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [generating, setGenerating] = useState(false);

    const formatPhone = (value: string) => {
        // Remove all non-numeric characters
        return value.replace(/\D/g, '');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
    };

    const getWhatsAppLink = () => {
        const cleanPhone = formatPhone(phone);
        const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
        return `https://wa.me/${cleanPhone}${encodedMessage}`;
    };

    const handleGenerate = async () => {
        if (!phone) {
            alert("Please enter a phone number");
            return;
        }

        setGenerating(true);
        const waLink = getWhatsAppLink();

        // Redirect to main generator with the WhatsApp link pre-filled
        window.location.href = `/#generator?url=${encodeURIComponent(waLink)}`;
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>

                <Card className="border-green-500/20 bg-green-500/5">
                    <CardHeader className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                            <MessageSquare className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle className="text-3xl">WhatsApp QR Generator</CardTitle>
                        <CardDescription className="text-base">
                            Create a QR code that opens a WhatsApp chat instantly when scanned
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="1234567890 (with country code, no + or spaces)"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Example: For +1 (555) 123-4567, enter: 15551234567
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Pre-filled Message (Optional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Hi! I found your QR code..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                This message will be pre-filled when someone scans the QR code
                            </p>
                        </div>

                        {phone && (
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm font-medium mb-2">Preview Link:</p>
                                <code className="text-xs break-all text-green-600">
                                    {getWhatsAppLink()}
                                </code>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleGenerate}
                            disabled={!phone || generating}
                        >
                            {generating ? "Generating..." : "Generate WhatsApp QR Code"}
                        </Button>

                        <div className="pt-6 border-t">
                            <h3 className="font-semibold mb-3">💡 Use Cases:</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• <strong>Businesses:</strong> Let customers contact you instantly</li>
                                <li>• <strong>Events:</strong> Easy registration or support</li>
                                <li>• <strong>Restaurants:</strong> Table ordering or reservations</li>
                                <li>• <strong>Real Estate:</strong> Property inquiries</li>
                                <li>• <strong>Freelancers:</strong> Quick client communication</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
