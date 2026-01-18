import { Header } from "@/components/layout/header";
import { QRGenerator } from "@/components/qr-generator";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 border-b-3 border-foreground bg-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-6 py-3 bg-accent border-3 border-foreground shadow-hard text-accent-foreground font-bold font-display text-sm uppercase tracking-widest mb-8 reveal-up reveal-up-1 transform -rotate-1">
            AI-Powered QR Generator
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] reveal-up reveal-up-2 mb-8 tracking-tighter">
            Turn Boring QRs into{" "}
            <span className="relative inline-block mx-2">
              <span className="relative z-10 text-primary">Digital Art</span>
              <span className="absolute bottom-1 left-0 w-full h-1/3 bg-foreground/10 -z-0 rotate-1"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto reveal-up reveal-up-3 mb-10 leading-relaxed">
            Generate stunning, scannable AI art QR codes in seconds.
            <span className="block mt-3 font-bold text-foreground bg-primary/10 inline-block px-2 transform rotate-1 border-2 border-transparent">Pay per use. No subscription required.</span>
          </p>
        </div>
      </section>

      {/* QR Generator */}
      <div className="bg-secondary/10 border-b-3 border-foreground">
        <QRGenerator />
      </div>

      {/* Footer */}
      <footer className="border-t-3 border-foreground bg-secondary/20 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary border-3 border-foreground shadow-[3px_3px_0_0_black] flex items-center justify-center">
                <span className="text-primary-foreground font-black font-display text-2xl">Q</span>
              </div>
              <span className="font-display font-black text-3xl tracking-tighter uppercase">QRaft</span>
            </div>

            <p className="font-display text-xl font-bold uppercase tracking-wide text-center md:text-right">
              Make the internet <br className="hidden md:block" /> a little less boring.
            </p>
          </div>

          <div className="border-t-3 border-foreground pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-muted-foreground font-mono">
            <p>© 2024 QRaft.ai. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors uppercase tracking-wider">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors uppercase tracking-wider">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
