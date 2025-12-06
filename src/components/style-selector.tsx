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
        description: "Neon glow, holographic grid, rain droplets",
        preview: "bg-gradient-to-br from-purple-900 to-pink-900",
        color: "border-pink-500 shadow-pink-500/50",
    },
    {
        id: "luxury",
        name: "Luxury Gold",
        description: "Marble texture, 24k gold modules, premium",
        preview: "bg-gradient-to-br from-yellow-900 to-yellow-700",
        color: "border-yellow-500 shadow-yellow-500/50",
    },
    {
        id: "sakura",
        name: "Watercolor Sakura",
        description: "Soft pink cherry blossoms, washi paper",
        preview: "bg-gradient-to-br from-pink-200 to-red-200",
        color: "border-pink-300 shadow-pink-300/50",
    },
    {
        id: "vaporwave",
        name: "Vaporwave",
        description: "Hot pink grid, palm trees, 80s aesthetic",
        preview: "bg-gradient-to-br from-cyan-500 to-purple-500",
        color: "border-cyan-400 shadow-cyan-400/50",
    },
    {
        id: "banksy",
        name: "Street Art",
        description: "Stencil style, brick wall, dripping paint",
        preview: "bg-gradient-to-br from-gray-800 to-gray-900",
        color: "border-red-600 shadow-red-600/50",
    },
    {
        id: "floral",
        name: "Victorian Floral",
        description: "Intricate vines, roses, antique parchment",
        preview: "bg-gradient-to-br from-amber-100 to-orange-100",
        color: "border-amber-600 shadow-amber-600/50",
    },
    {
        id: "isometric",
        name: "3D Isometric",
        description: "Tiny buildings, floating island, pastel",
        preview: "bg-gradient-to-br from-blue-200 to-indigo-300",
        color: "border-indigo-400 shadow-indigo-400/50",
    },
    {
        id: "swiss",
        name: "Swiss Minimal",
        description: "Bold geometry, negative space, bauhaus",
        preview: "bg-gradient-to-br from-white to-gray-200",
        color: "border-red-500 shadow-red-500/50",
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
                            "relative cursor-pointer overflow-hidden border-2 transition-all duration-300 h-40 group",
                            selectedStyle === style.id
                                ? `${style.color} bg-accent/5`
                                : "border-transparent hover:border-white/20 bg-secondary/50"
                        )}
                        onClick={() => onSelect(style.id)}
                    >
                        {/* Preview Placeholder - replace with real images later */}
                        <div className={cn("absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity", style.preview)} />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-white text-sm">{style.name}</span>
                                {selectedStyle === style.id && (
                                    <div className="bg-primary rounded-full p-1">
                                        <Check className="w-3 h-3 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-300 line-clamp-2 mt-1">
                                {style.description}
                            </p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
