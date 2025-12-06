import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle2, Mail, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import anime from 'animejs';

interface WaitlistFormProps {
    children?: React.ReactNode;
}

export default function WaitlistForm({ children }: WaitlistFormProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState(false);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (countRef.current) {
            anime({
                targets: countRef.current,
                innerHTML: [300, 243],
                round: 1,
                easing: 'easeInOutExpo',
                duration: 2000,
                delay: 500
            });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: supabaseError } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (supabaseError) throw supabaseError;

            setSuccess(true);
            setEmail('');

            // Trigger confetti reward
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const random = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

        } catch (err: any) {
            console.error('Error joining waitlist:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-background/50 backdrop-blur-xl border border-green-500/20 shadow-2xl text-center"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-4">You're on the list!</h3>
                <p className="text-muted-foreground text-lg">
                    Welcome to the future of QR codes. We'll be in touch soon.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto relative group">
            {/* Glow effect */}
            {/* Glow effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-500"></div>

            <div className="relative p-8 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Join the Exclusive Waitlist</h3>
                    <p className="text-muted-foreground">
                        Be among the first 300 users to get the <span className="text-foreground font-semibold">Lifetime Deal ($49)</span>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border bg-background/50 transition-all duration-300",
                        focused ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-input hover:border-primary/50"
                    )}>
                        <Mail className={cn("w-5 h-5 transition-colors", focused ? "text-primary" : "text-muted-foreground")} />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            required
                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group/btn relative overflow-hidden"
                        disabled={loading}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            <span className="flex items-center gap-2">
                                Secure My Spot <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                        <div className="flex -space-x-2">
                            {children}
                        </div>
                        <p><span ref={countRef} className="font-semibold text-primary">300</span> spots remaining</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
