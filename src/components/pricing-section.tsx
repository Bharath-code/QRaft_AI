"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Country = "IN" | "ROW";

export function PricingSection() {
    const [country, setCountry] = useState<Country>("ROW");
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    useEffect(() => {
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data.country_code === "IN") {
                    setCountry("IN");
                }
            })
            .catch((err) => console.error("Geo-detection failed:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleCheckout = async (productId: string) => {
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    countryCode: country
                }),
            });
            const data = await res.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (loading) {
        return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    }

    return (
        <section className="py-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground text-lg">
                        {country === "IN"
                            ? "Pay per QR or subscribe for unlimited access via UPI."
                            : "Pay as you go or get unlimited with Pro."}
                    </p>

                    {country === "ROW" && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-4 py-2 font-bold uppercase text-sm tracking-wide border-3 border-foreground transition-colors ${billingCycle === "monthly" ? "bg-foreground text-background" : "bg-background"
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`px-4 py-2 font-bold uppercase text-sm tracking-wide border-3 border-foreground transition-colors ${billingCycle === "yearly" ? "bg-foreground text-background" : "bg-background"
                                    }`}
                            >
                                Yearly (Save 20%)
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Single QR */}
                    <div className="brutalist-card p-8 flex flex-col">
                        <div className="mb-6">
                            <h3 className="font-display font-bold text-xl">Single QR</h3>
                            <div className="font-display text-4xl font-bold mt-2">
                                {country === "IN" ? "₹49" : "$1.99"}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">per QR code</p>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <PricingItem>1 Premium AI QR Code</PricingItem>
                            <PricingItem>High Resolution PNG</PricingItem>
                            <PricingItem>No Watermark</PricingItem>
                            <PricingItem>Lifetime Ownership</PricingItem>
                        </ul>
                        <button
                            onClick={() => handleCheckout(country === "IN" ? "prod_single_inr" : "prod_single_usd")}
                            className="w-full p-4 border-3 border-foreground bg-background font-bold uppercase tracking-wide hover:bg-muted transition-colors"
                        >
                            Buy Once
                        </button>
                    </div>

                    {/* Pro / Career Pack */}
                    {country === "IN" ? (
                        <div className="brutalist-card p-8 flex flex-col border-primary relative">
                            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                                Bestseller
                            </div>
                            <div className="mb-6">
                                <h3 className="font-display font-bold text-xl text-primary">Career Pack</h3>
                                <div className="font-display text-4xl font-bold mt-2">₹199</div>
                                <p className="text-sm text-muted-foreground mt-1">for 5 QR codes</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingItem>5 Premium AI Generations</PricingItem>
                                <PricingItem>Perfect for Resume/Portfolio</PricingItem>
                                <PricingItem>~₹40 per QR</PricingItem>
                                <PricingItem>No Expiry on Credits</PricingItem>
                            </ul>
                            <button
                                onClick={() => handleCheckout("prod_career_pack_inr")}
                                className="brutalist-btn w-full"
                            >
                                Get Career Pack
                            </button>
                        </div>
                    ) : (
                        <div className="brutalist-card p-8 flex flex-col border-primary relative">
                            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                                Most Popular
                            </div>
                            <div className="mb-6">
                                <h3 className="font-display font-bold text-xl text-primary">Pro</h3>
                                <div className="font-display text-4xl font-bold mt-2">
                                    {billingCycle === "monthly" ? "$9" : "$79"}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {billingCycle === "monthly" ? "per month" : "per year"}
                                </p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingItem>Unlimited Generations</PricingItem>
                                <PricingItem>All Art Styles</PricingItem>
                                <PricingItem>Priority Processing</PricingItem>
                                <PricingItem>Commercial License</PricingItem>
                            </ul>
                            <button
                                onClick={() => handleCheckout(billingCycle === "monthly" ? "prod_pro_monthly_usd" : "prod_pro_yearly_usd")}
                                className="brutalist-btn w-full"
                            >
                                Start Pro Trial
                            </button>
                        </div>
                    )}

                    {/* Third Card */}
                    {country === "IN" ? (
                        <div className="brutalist-card p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="font-display font-bold text-xl">Pro Monthly</h3>
                                <div className="font-display text-4xl font-bold mt-2">₹699</div>
                                <p className="text-sm text-muted-foreground mt-1">per month</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingItem>Unlimited Generations</PricingItem>
                                <PricingItem>Priority Processing</PricingItem>
                                <PricingItem>Commercial License</PricingItem>
                                <PricingItem>Cancel Anytime</PricingItem>
                            </ul>
                            <button
                                onClick={() => handleCheckout("prod_pro_monthly_inr")}
                                className="w-full p-4 border-3 border-foreground bg-background font-bold uppercase tracking-wide hover:bg-muted transition-colors"
                            >
                                Subscribe
                            </button>
                        </div>
                    ) : (
                        <div className="brutalist-card p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="font-display font-bold text-xl">Lifetime</h3>
                                <div className="font-display text-4xl font-bold mt-2">$49</div>
                                <p className="text-sm text-muted-foreground mt-1">one-time payment</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingItem>Forever Access</PricingItem>
                                <PricingItem>No Monthly Fees</PricingItem>
                                <PricingItem>Future Updates</PricingItem>
                                <PricingItem>All Features Included</PricingItem>
                            </ul>
                            <button
                                onClick={() => handleCheckout("prod_lifetime_usd")}
                                className="w-full p-4 border-3 border-foreground bg-background font-bold uppercase tracking-wide hover:bg-muted transition-colors"
                            >
                                Get Lifetime Deal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function PricingItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex gap-3 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{children}</span>
        </li>
    );
}
