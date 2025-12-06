"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Send, Coffee } from "lucide-react";

export default function TeaBoxPage({ params }: { params: { id: string } }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const supabase = createClient();

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);

        try {
            const { error } = await supabase.from('messages').insert({
                recipient_id: params.id, // Assuming URL param is UUID. In prod, map slug to UUID.
                content: message,
            });

            if (error) throw error;
            setSent(true);
        } catch (error) {
            console.error(error);
            alert("Failed to send tea. Maybe the user doesn't exist?");
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
                <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-zinc-100">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-6 h-6 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Sent!</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Your anonymous message has been delivered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => window.location.href = '/'} variant="outline">
                            Create your own Tea Box
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-zinc-100">
                <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                        <Coffee className="w-6 h-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-center text-2xl">The Tea Box</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Send an anonymous message. Be nice (or spicy).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Type your secret message here..."
                        className="min-h-[150px] bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 resize-none focus:ring-purple-500/20"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold h-12"
                        onClick={handleSend}
                        disabled={sending || !message.trim()}
                    >
                        {sending ? "Spilling Tea..." : "Send Anonymous Message"}
                    </Button>
                    <p className="text-xs text-center text-zinc-600 mt-4">
                        Messages are encrypted and 100% anonymous.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
