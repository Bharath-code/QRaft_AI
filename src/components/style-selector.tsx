"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type QRStyle = {
    id: string;
    name: string;
    description: string;
    preview: string; // In a real app, these would be image URLs
    color: string;
};

export const STYLES: QRStyle[] = [
    {
        id: "cyberpunk",
        name: "Cyberpunk Neon",
        description: "Holographic glow, futuristic city, digital rain",
        preview: "bg-gradient-to-br from-purple-900 to-pink-900",
        color: "border-pink-500",
    },
    {
        id: "luxury",
        name: "Luxury Gold",
        description: "24k gold textures, marble, premium drippy",
        preview: "bg-gradient-to-br from-yellow-900 to-yellow-700",
        color: "border-yellow-500",
    },
    {
        id: "sakura",
        name: "Lo-fi Sakura",
        description: "Soft pink aesthetic, anime vibe, ethereal",
        preview: "bg-gradient-to-br from-pink-200 to-red-200",
        color: "border-pink-300",
    },
    {
        id: "vaporwave",
        name: "Vaporwave",
        description: "80s retro, chrome, glitch, synthwave grid",
        preview: "bg-gradient-to-br from-cyan-500 to-purple-500",
        color: "border-cyan-400",
    },
    {
        id: "banksy",
        name: "Street Art",
        description: "Stencil graffiti, urban wall, rebellious",
        preview: "bg-gradient-to-br from-gray-800 to-gray-900",
        color: "border-red-600",
    },
    {
        id: "floral",
        name: "Cottagecore",
        description: "Vintage floral, roses, botanical aesthetic",
        preview: "bg-gradient-to-br from-amber-100 to-orange-100",
        color: "border-amber-600",
    },
    {
        id: "isometric",
        name: "3D Isometric",
        description: "Cozy tiny world, pastel, floating island",
        preview: "bg-gradient-to-br from-blue-200 to-indigo-300",
        color: "border-indigo-400",
    },
    {
        id: "swiss",
        name: "Swiss Minimal",
        description: "Clean typography, bold geometry, poster art",
        preview: "bg-gradient-to-br from-white to-gray-200",
        color: "border-red-500",
    },
    {
        id: "abstract",
        name: "Acid Liquid",
        description: "Y2K aesthetic, trippy oil spill, vibrant",
        preview: "bg-gradient-to-br from-indigo-500 to-purple-500",
        color: "border-indigo-500",
    },
    {
        id: "paper",
        name: "Paper Craft",
        description: "DIY origami, layered depth, handmade feel",
        preview: "bg-gradient-to-br from-emerald-100 to-teal-100",
        color: "border-emerald-500",
    },
];

interface StyleSelectorProps {
    selectedStyle: string;
    onSelect: (id: string) => void;
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STYLES.map((style) => (
                <motion.div
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Card
                        className={cn(
                            "relative cursor-pointer overflow-hidden border-3 transition-all duration-150 h-40 group rounded-none",
                            selectedStyle === style.id
                                ? `${style.color} shadow-hard bg-accent/10`
                                : "border-muted-foreground/20 hover:border-foreground/50 bg-secondary/50 hover:shadow-hard"
                        )}
                        onClick={() => onSelect(style.id)}
                    >
                        {/* Preview Placeholder - replace with real images later */}
                        <div className={cn("absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity", style.preview)} />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-white text-sm font-display uppercase tracking-wide">{style.name}</span>
                                {selectedStyle === style.id && (
                                    <div className="bg-primary rounded-none p-1 border border-foreground shadow-[2px_2px_0_0_black]">
                                        <Check className="w-3 h-3 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-300 line-clamp-2 mt-1 font-mono">
                                {style.description}
                            </p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
