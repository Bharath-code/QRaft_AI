"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
    onColorSelect: (color: string) => void;
    selectedColor: string;
}

const PRESET_COLORS = [
    "#000000", // Black
    "#2563EB", // Blue
    "#DC2626", // Red
    "#16A34A", // Green
    "#9333EA", // Purple
];

export function ColorPicker({ onColorSelect, selectedColor }: ColorPickerProps) {
    const [customColor, setCustomColor] = useState(selectedColor);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setCustomColor(color);
        onColorSelect(color);
    };

    return (
        <div className="space-y-3">
            <Label>Brand Color</Label>
            <div className="flex gap-3 items-center">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => onColorSelect(color)}
                        className={cn(
                            "w-8 h-8 rounded-full border border-white/10 relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            selectedColor === color && "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                    >
                        {selectedColor === color && (
                            <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                    </button>
                ))}

                <div className="relative ml-2">
                    <Input
                        type="color"
                        value={customColor}
                        onChange={handleCustomChange}
                        className="w-10 h-10 p-0.5 border-none bg-transparent rounded-lg cursor-pointer overflow-hidden"
                    />
                </div>
            </div>
        </div>
    );
}
