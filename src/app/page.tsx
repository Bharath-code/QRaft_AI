import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { QRGenerator } from "@/components/qr-generator";
import { PricingSection } from "@/components/pricing-section";
import Link from "next/link";
import { ArrowRight, Zap, Coffee, Link2, Layers, MessageSquare, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />

      {/* Hero Section - Asymmetric Layout */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6">
              <div className="reveal-up reveal-up-1">
                <span className="inline-block px-4 py-2 bg-accent text-accent-foreground font-bold text-sm uppercase tracking-wide">
                  AI-Powered QR Generator
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] reveal-up reveal-up-2">
                Turn Boring QRs into{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Digital Art</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-primary -z-0 -rotate-1"></span>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg reveal-up reveal-up-3">
                Generate stunning, scannable AI art QR codes in seconds. 8 unique styles. No design skills needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 reveal-up reveal-up-4">
                <a href="#generator" className="brutalist-btn inline-flex items-center justify-center gap-2">
                  Create Your QR <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/templates"
                  className="px-6 py-3 border-3 border-foreground bg-background font-bold uppercase tracking-wide text-center hover:bg-muted transition-colors"
                >
                  Browse Templates
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-8 reveal-up reveal-up-5">
                <p className="text-sm text-muted-foreground mb-2">TRUSTED BY CREATORS</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                    ))}
                  </div>
                  <span className="font-bold">500+ QR codes generated</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="md:col-span-5 reveal-up reveal-up-3">
              <div className="brutalist-card p-4 rotate-2 hover:rotate-0 transition-transform">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="font-display text-xl font-bold">Your QR Here</p>
                    <p className="text-sm text-muted-foreground">Scroll down to create</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Generator */}
      <section id="generator" className="py-16 md:py-24 border-b-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Create Your Masterpiece</h2>
            <p className="text-muted-foreground">Paste a URL, pick a style, and watch the magic happen.</p>
          </div>
          <QRGenerator />
        </div>
      </section>

      {/* Features Grid - Dynamic Layout */}
      <section className="py-16 md:py-24 border-b-3 border-foreground">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">More Than Just QRs</h2>
            <p className="text-muted-foreground">Powerful tools for students, creators, and professionals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Coffee className="h-6 w-6" />}
              title="Tea Box"
              description="Anonymous confession messages"
              href="/tea"
            />
            <FeatureCard
              icon={<Link2 className="h-6 w-6" />}
              title="Smart Links"
              description="Trackable shortlinks with analytics"
              href="/dashboard/links"
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="WhatsApp QR"
              description="Direct chat links"
              href="/whatsapp"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Story Bio"
              description="Instagram bio generator"
              href="/story-bio"
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Templates"
              description="LinkedIn, PayPal & more"
              href="/templates"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Batch Mode"
              description="Generate 5 at once"
              href="/#generator"
              badge="PRO"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <PricingSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">Q</span>
              </div>
              <span>QRaft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 QRaft.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Spacer for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="brutalist-card p-6 h-full relative group">
        {badge && (
          <span className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
            {badge}
          </span>
        )}
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
