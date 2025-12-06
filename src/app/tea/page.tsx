import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowRight, MessageSquare, Lock, Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TeaBoxLandingPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 px-4">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

                <div className="container max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-xl mb-6">
                        <Coffee className="mr-2 h-4 w-4" />
                        <span>Anonymous Messaging Made Fun</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
                        The Tea Box ☕
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Get anonymous messages from friends, crushes, and secret admirers.
                        Perfect for students who want to know what people really think!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {session ? (
                            <>
                                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    <Link href="/dashboard/tea">
                                        View My Tea Inbox <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={`/tea/${session.user.id}`} target="_blank">
                                        My Public Link
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    <Link href="/login">
                                        Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="#how-it-works">
                                        How It Works
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 bg-muted/20">
                <div className="container max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                                    <Lock className="h-6 w-6 text-purple-500" />
                                </div>
                                <CardTitle>100% Anonymous</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Messages are completely anonymous. No tracking, no IP logging.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-pink-500" />
                                </div>
                                <CardTitle>For Everyone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Students, creators, anyone who wants honest feedback.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                    <MessageSquare className="h-6 w-6 text-blue-500" />
                                </div>
                                <CardTitle>Easy to Share</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Share your unique link on Instagram, Snapchat, or anywhere.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 px-4">
                <div className="container max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Sign Up (Free)</h3>
                                <p className="text-muted-foreground">
                                    Create your account in seconds. No credit card required.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Share Your Link</h3>
                                <p className="text-muted-foreground">
                                    Get your unique Tea Box link and share it on your Instagram bio, Snapchat, or anywhere.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Receive Anonymous Messages</h3>
                                <p className="text-muted-foreground">
                                    People can send you anonymous messages. Check your Tea Inbox to see what they said!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Link href={session ? "/dashboard/tea" : "/login"}>
                                {session ? "Go to My Tea Inbox" : "Start Receiving Messages"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                <div className="container max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Spill the Tea?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of students already using Tea Box
                    </p>
                    <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100">
                        <Link href={session ? "/dashboard/tea" : "/login"}>
                            Get Started Free
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
