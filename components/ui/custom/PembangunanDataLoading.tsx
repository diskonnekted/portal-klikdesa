"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PembangunanDataLoadingProps {
    className?: string;
    onTimeout?: () => void;
}

export function PembangunanDataLoading({ className, onTimeout }: PembangunanDataLoadingProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onTimeout?.();
        }, 30000);

        return () => clearTimeout(timer);
    }, [onTimeout]);

    return (
        <div className={cn("flex items-center justify-center py-12", className)}>
            <div className="flex flex-col items-center justify-center py-16 px-8">
                {/* Animated SVG Illustration */}
                <div className="relative mb-8">
                    <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-lg">
                        {/* Background gradient circle */}
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 0.1 }} />
                                <stop offset="100%" style={{ stopColor: "#eab308", stopOpacity: 0.1 }} />
                            </linearGradient>
                            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: "#eab308", stopOpacity: 0.3 }} />
                            </linearGradient>
                        </defs>

                        {/* Outer rotating ring */}
                        <circle
                            cx="110"
                            cy="110"
                            r="90"
                            fill="none"
                            stroke="url(#grad1)"
                            strokeWidth="3"
                            strokeDasharray="15 10"
                            className="animate-spin"
                            style={{ animationDuration: "3s" }}
                        />

                        {/* Inner rotating ring (opposite direction) */}
                        <circle
                            cx="110"
                            cy="110"
                            r="75"
                            fill="none"
                            stroke="url(#grad2)"
                            strokeWidth="2"
                            strokeDasharray="10 5"
                            className="animate-spin"
                            style={{ animationDuration: "2s", animationDirection: "reverse" }}
                        />

                        {/* Center loading icon */}
                        <g transform="translate(110, 110)">
                            {/* Construction cranes stack */}
                            <g>
                                {/* Crane base 1 (top) */}
                                <rect
                                    x="-50"
                                    y="-30"
                                    width="100"
                                    height="40"
                                    rx="8"
                                    fill="#f97316"
                                    className="animate-pulse"
                                />
                                {/* Crane base 2 (middle) */}
                                <rect
                                    x="-50"
                                    y="10"
                                    width="100"
                                    height="40"
                                    rx="8"
                                    fill="#eab308"
                                    className="animate-pulse"
                                    style={{ animationDelay: "0.3s" }}
                                />
                                {/* Crane base 3 (bottom) */}
                                <rect
                                    x="-50"
                                    y="50"
                                    width="100"
                                    height="40"
                                    rx="8"
                                    fill="#f59e0b"
                                    className="animate-pulse"
                                    style={{ animationDelay: "0.6s" }}
                                />

                                {/* Data flow lines */}
                                <g className="opacity-60">
                                    <path
                                        d="M -30 -10 Q -15 -20 0 -10 T 30 -10"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                        className="animate-[dash_2s_linear_infinite]"
                                        strokeDasharray="5 5"
                                    />
                                    <path
                                        d="M -30 30 Q -15 20 0 30 T 30 30"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                        className="animate-[dash_2s_linear_infinite]"
                                        strokeDasharray="5 5"
                                        style={{ animationDelay: "0.5s" }}
                                    />
                                    <path
                                        d="M -30 70 Q -15 60 0 70 T 30 70"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                        className="animate-[dash_2s_linear_infinite]"
                                        strokeDasharray="5 5"
                                        style={{ animationDelay: "1s" }}
                                    />
                                </g>

                                {/* Processing dots */}
                                <g>
                                    <circle cx="-20" cy="-20" r="4" fill="#ef4444" className="animate-bounce" />
                                    <circle
                                        cx="0"
                                        cy="-20"
                                        r="4"
                                        fill="#10b981"
                                        className="animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                    <circle
                                        cx="20"
                                        cy="-20"
                                        r="4"
                                        fill="#3b82f6"
                                        className="animate-bounce"
                                        style={{ animationDelay: "0.4s" }}
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>

                {/* Loading text */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">Memuat Data Pembangunan</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Mengambil data dari{" "}
                    <span className="text-foreground font-bold">Sistem Informasi Pembangunan Desa</span>
                    ...
                </p>

                {/* Status dots */}
                <div className="flex gap-2 mt-6">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <div
                        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    />
                    <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    />
                </div>
            </div>
        </div>
    );
}
