"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LogoUploaderProps {
    onLogoSelect: (file: File | null) => void;
}

export function LogoUploader({ onLogoSelect }: LogoUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                onLogoSelect(file);
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
            }
        },
        [onLogoSelect]
    );

    const removeLogo = (e: React.MouseEvent) => {
        e.stopPropagation();
        onLogoSelect(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/svg+xml": [],
        },
        maxFiles: 1,
        maxSize: 2 * 1024 * 1024, // 2MB
    });

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Upload Brand Logo (Optional)
            </label>
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 h-32 ${isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-secondary/50"
                    }`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-20 h-20">
                            <Image
                                src={preview}
                                alt="Logo preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={removeLogo}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="p-2 rounded-full bg-secondary/50">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">
                                {isDragActive
                                    ? "Drop logo here"
                                    : "Click to upload or drag & drop"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60">
                                PNG, JPG, SVG up to 2MB
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
