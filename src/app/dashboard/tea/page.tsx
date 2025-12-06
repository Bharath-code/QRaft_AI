import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { MessageSquare, Clock } from "lucide-react";

export default async function TeaInboxPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect("/login");

    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container py-12 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Tea Box ☕</h1>
                <p className="text-muted-foreground">Anonymous messages from your friends (and secret admirers).</p>
            </div>

            <div className="grid gap-4">
                {!messages || messages.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground bg-secondary/20 border-dashed">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No tea spilled yet. Share your link!</p>
                        <code className="block mt-4 p-2 bg-background rounded border text-xs">
                            qraft.ai/tea/{session.user.id}
                        </code>
                    </Card>
                ) : (
                    messages.map((msg: any) => (
                        <Card key={msg.id} className="bg-card hover:bg-accent/5 transition-colors">
                            <CardContent className="p-6">
                                <p className="text-lg font-medium mb-4 leading-relaxed">
                                    "{msg.content}"
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString()}
                                    <span className="ml-auto font-mono text-purple-400">Anonymous</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
