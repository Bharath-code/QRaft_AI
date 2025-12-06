"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
    target: string;
    title: string;
    content: string;
}

interface TourContextType {
    startTour: (tourId: string, steps: TourStep[]) => void;
    endTour: () => void;
    isActive: boolean;
}

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<TourStep[]>([]);
    const [tourId, setTourId] = useState("");
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const startTour = (id: string, tourSteps: TourStep[]) => {
        // Check if already seen
        const seenTours = JSON.parse(localStorage.getItem("qraft_tours") || "[]");
        if (seenTours.includes(id)) return;

        setTourId(id);
        setSteps(tourSteps);
        setCurrentStep(0);
        setIsActive(true);
    };

    const endTour = () => {
        setIsActive(false);
        // Mark as seen
        const seenTours = JSON.parse(localStorage.getItem("qraft_tours") || "[]");
        if (!seenTours.includes(tourId)) {
            seenTours.push(tourId);
            localStorage.setItem("qraft_tours", JSON.stringify(seenTours));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            endTour();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Position tooltip near target element
    useEffect(() => {
        if (!isActive || !steps[currentStep]) return;

        const target = document.querySelector(steps[currentStep].target);
        if (target) {
            const rect = target.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 10,
                left: Math.max(10, rect.left + (rect.width / 2) - 150)
            });
            // Highlight element
            target.classList.add("ring-2", "ring-purple-500", "ring-offset-2");
        }

        return () => {
            if (target) {
                target.classList.remove("ring-2", "ring-purple-500", "ring-offset-2");
            }
        };
    }, [isActive, currentStep, steps]);

    return (
        <TourContext.Provider value={{ startTour, endTour, isActive }}>
            {children}

            {/* Tour Overlay */}
            {isActive && steps[currentStep] && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={endTour} />

                    {/* Tooltip */}
                    <div
                        className="fixed z-[9999] bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-[300px] animate-in fade-in slide-in-from-bottom-2"
                        style={{ top: position.top, left: position.left }}
                    >
                        <button
                            onClick={endTour}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <h3 className="font-semibold text-lg mb-2">{steps[currentStep].title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{steps[currentStep].content}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {currentStep + 1} / {steps.length}
                            </span>
                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button size="sm" variant="outline" onClick={prevStep}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button size="sm" onClick={nextStep}>
                                    {currentStep === steps.length - 1 ? "Done" : "Next"}
                                    {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </TourContext.Provider>
    );
}

export function useTour() {
    const context = useContext(TourContext);
    if (!context) throw new Error("useTour must be used within TourProvider");
    return context;
}

// Predefined tour steps
export const DASHBOARD_TOUR: TourStep[] = [
    {
        target: "[data-tour='plan-card']",
        title: "📊 Your Plan",
        content: "View your current plan and credits. Upgrade to Pro for unlimited generations!"
    },
    {
        target: "[data-tour='quick-actions']",
        title: "⚡ Quick Actions",
        content: "Access all features: Tea Box, Smart Links, Analytics, and more!"
    },
    {
        target: "[data-tour='gallery']",
        title: "🎨 Your Gallery",
        content: "All your generated QR codes appear here. Download or share anytime!"
    }
];

export const GENERATOR_TOUR: TourStep[] = [
    {
        target: "[data-tour='url-input']",
        title: "🔗 Enter URL",
        content: "Start by entering the URL you want to encode."
    },
    {
        target: "[data-tour='style-selector']",
        title: "🎨 Pick Style",
        content: "Choose from 8 AI art styles for your QR code."
    },
    {
        target: "[data-tour='generate-button']",
        title: "🚀 Generate!",
        content: "Click to create your AI-powered QR code!"
    }
];
