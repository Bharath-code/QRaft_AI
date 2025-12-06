import React from "react";
import {
    IconArtboard,
    IconBolt,
    IconBriefcase,
    IconRadar,
    IconMessage,
    IconBrandWhatsapp,
    IconTemplate,
    IconChartBar,
} from "@tabler/icons-react";

const features = [
    {
        title: "Tea Box",
        subtitle: "Anonymous Confessions",
        description: "Share your QR on Instagram story. Get anonymous messages. Reply publicly. The ultimate campus flex.",
        icon: <IconMessage className="h-6 w-6" />,
        persona: "Students",
        className: "md:col-span-2",
    },
    {
        title: "Recruiter Radar",
        subtitle: "Know When They Scan",
        description: "Get an email the SECOND someone scans your resume. Location, device, time — all tracked.",
        icon: <IconRadar className="h-6 w-6" />,
        persona: "Job Seekers",
        badge: "PRO",
    },
    {
        title: "LinkedIn Deep-Link",
        subtitle: "Skip the Browser",
        description: "Opens the LinkedIn app directly on mobile instead of the annoying browser login page. 3x more connections.",
        icon: <IconBriefcase className="h-6 w-6" />,
        persona: "Job Seekers",
    },
    {
        title: "Story Mode Bio",
        subtitle: "Instagram Bio Generator",
        description: "Generate aesthetic bios for your profile. Templates for students, job seekers, and creators.",
        icon: <IconArtboard className="h-6 w-6" />,
        persona: "Students",
    },
    {
        title: "WhatsApp QR",
        subtitle: "Direct Chat Links",
        description: "Create a QR that opens WhatsApp with your number pre-filled. Add a custom message too.",
        icon: <IconBrandWhatsapp className="h-6 w-6" />,
        persona: "Everyone",
    },
    {
        title: "QR Templates",
        subtitle: "16 Ready-Made Presets",
        description: "LinkedIn, PayPal, UPI, WiFi, Resume, Portfolio — pick a template, paste your link, done.",
        icon: <IconTemplate className="h-6 w-6" />,
        persona: "Creators",
        className: "md:col-span-2",
    },
    {
        title: "Sticker Sheet PDF",
        subtitle: "Print-Ready A4",
        description: "Download a 3x3 grid of your QR on an A4 PDF with cutting guides. Perfect for events and merch.",
        icon: <IconArtboard className="h-6 w-6" />,
        persona: "Creators",
    },
    {
        title: "Analytics Dashboard",
        subtitle: "Track Every Scan",
        description: "See total scans, top countries, devices, and detailed events for each of your tracked links.",
        icon: <IconChartBar className="h-6 w-6" />,
        persona: "Job Seekers",
        badge: "PRO",
    },
];

export default function Features() {
    return (
        <section className="py-16 md:py-24 bg-background border-b-3 border-foreground" id="features">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <span className="inline-block px-4 py-2 bg-accent text-accent-foreground font-bold text-sm uppercase tracking-wide mb-4">
                        <IconBolt className="w-4 h-4 inline mr-2" /> The Full Toolkit
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need to Stand Out
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        We built the features students asked for, job seekers needed, and creators dreamed of.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className={`brutalist-card p-6 relative ${item.className || ''}`}
                        >
                            {item.badge && (
                                <span className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase">
                                    {item.badge}
                                </span>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-primary">{item.icon}</span>
                                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-2 py-0.5">
                                    {item.persona}
                                </span>
                            </div>
                            <h3 className="font-display font-bold text-xl mb-1">{item.title}</h3>
                            <p className="text-sm text-primary font-medium mb-2">{item.subtitle}</p>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
