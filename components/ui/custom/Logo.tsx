"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
    size?: number | string;
    className?: string;
    variant?: "default" | "monochrome" | "light";
    showBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 48, className }) => {
    const pixelSize = typeof size === "number" ? `${size}px` : size;

    return (
        <div className={cn("inline-block", className)} style={{ width: pixelSize, height: pixelSize }}>
            <Image
                src="/images/logo.png"
                alt="Logo Desa Sijenggung"
                width={typeof size === "number" ? size : 48}
                height={typeof size === "number" ? size : 48}
                className="w-full h-full object-contain"
                priority
            />
        </div>
    );
};

// Preset sizes for common use cases
export const LogoSizes = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    "2xl": 96,
    "3xl": 128,
    "4xl": 192,
    "5xl": 256,
    full: "100%",
} as const;

// Logo variants for specific use cases
export const LogoVariant: Record<string, React.ComponentProps<typeof Logo>> = {
    // Default green logo with background
    default: { variant: "default", showBackground: true },

    // For dark backgrounds
    light: { variant: "light", showBackground: true },

    // Monochrome for minimal designs
    monochrome: { variant: "monochrome", showBackground: true },

    // Icon only (no background circle)
    icon: { showBackground: false },

    // Small icon for navigation
    nav: { size: LogoSizes.sm, showBackground: false },

    // Medium size for headers
    header: { size: LogoSizes.lg },

    // Large size for landing pages
    hero: { size: LogoSizes["4xl"] },

    // Full width for containers
    responsive: { size: "100%", className: "max-w-xs" },

    // Small size for footer (dark background)
    footer: { size: LogoSizes.lg, variant: "light", className: "w-10 h-10" },
};
