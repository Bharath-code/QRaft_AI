"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        Purchase Credits or Upgrade
                    </DialogTitle>
                    <DialogDescription>
                        To generate QR codes, purchase credits or subscribe to Pro for unlimited access.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4 border rounded-lg p-4 bg-muted/50">
                        <div className="flex-1">
                            <h4 className="font-semibold">Career Pack (5 QRs)</h4>
                            <p className="text-sm text-muted-foreground">Perfect for job seekers</p>
                        </div>
                        <div className="font-bold text-lg">₹199</div>
                    </div>

                    <div className="flex items-center gap-4 border rounded-lg p-4 border-primary/20 bg-primary/5">
                        <div className="flex-1">
                            <h4 className="font-semibold text-primary">Pro Monthly</h4>
                            <p className="text-sm text-muted-foreground">Unlimited access</p>
                        </div>
                        <div className="font-bold text-lg text-primary">₹699</div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button className="w-full bg-primary" onClick={() => window.location.href = "/#pricing"}>
                        View All Plans
                    </Button>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Maybe Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
