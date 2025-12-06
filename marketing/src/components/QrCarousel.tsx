import React from 'react';
import { motion } from 'framer-motion';

const QR_CODES = [
    { id: 1, color: 'from-pink-500 to-violet-500', label: 'Artistic' },
    { id: 2, color: 'from-cyan-500 to-blue-500', label: 'Cyberpunk' },
    { id: 3, color: 'from-emerald-500 to-teal-500', label: 'Nature' },
    { id: 4, color: 'from-orange-500 to-amber-500', label: 'Luxury' },
    { id: 5, color: 'from-rose-500 to-red-500', label: 'Brand' },
    { id: 6, color: 'from-slate-900 to-slate-700', label: 'Minimal' },
];

// Duplicate for infinite scroll effect
const CAROUSEL_ITEMS = [...QR_CODES, ...QR_CODES, ...QR_CODES];

export default function QrCarousel() {
    return (
        <div className="w-full overflow-hidden bg-background py-12">
            <div className="relative w-full max-w-7xl mx-auto px-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />

                <motion.div
                    className="flex gap-8"
                    animate={{
                        x: [0, -1000], // Adjust based on width of items
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {CAROUSEL_ITEMS.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex-shrink-0 w-64 h-64 rounded-xl bg-gradient-to-br p-1 shadow-lg hover:scale-105 transition-transform duration-300"
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                            }}
                        >
                            <div className={`w-full h-full rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                                <span className="text-white font-bold text-xl">{item.label} QR</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
