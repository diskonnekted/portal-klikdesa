"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WilayahDataLoadingProps {
    className?: string;
    onTimeout?: () => void;
}

export function WilayahDataLoading({ className, onTimeout }: WilayahDataLoadingProps) {
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
                            <linearGradient id="wilayah-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.1 }} />
                                <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 0.1 }} />
                            </linearGradient>
                            <linearGradient id="wilayah-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 0.3 }} />
                            </linearGradient>
                        </defs>

                        {/* Outer rotating ring */}
                        <circle
                            cx="110"
                            cy="110"
                            r="90"
                            fill="none"
                            stroke="url(#wilayah-grad1)"
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
                            stroke="url(#wilayah-grad2)"
                            strokeWidth="2"
                            strokeDasharray="10 5"
                            className="animate-spin"
                            style={{ animationDuration: "2s", animationDirection: "reverse" }}
                        />

                        {/* Center loading icon */}
                        <g transform="translate(110, 110)">
                            {/* Map structure */}
                            <g>
                                {/* Building structure */}
                                <g>
                                    {/* Base rectangle (village area) */}
                                    <rect
                                        x="-60"
                                        y="40"
                                        width="120"
                                        height="30"
                                        rx="6"
                                        fill="#06b6d4"
                                        className="animate-pulse"
                                    />

                                    {/* Middle layer (RW areas) */}
                                    <rect
                                        x="-40"
                                        y="0"
                                        width="80"
                                        height="30"
                                        rx="6"
                                        fill="#0ea5e9"
                                        className="animate-pulse"
                                        style={{ animationDelay: "0.3s" }}
                                    />

                                    {/* Top layer (RT areas) */}
                                    <rect
                                        x="-20"
                                        y="-40"
                                        width="40"
                                        height="30"
                                        rx="6"
                                        fill="#3b82f6"
                                        className="animate-pulse"
                                        style={{ animationDelay: "0.6s" }}
                                    />

                                    {/* Connection lines */}
                                    <g className="opacity-60">
                                        <line
                                            x1="0"
                                            y1="10"
                                            x2="0"
                                            y2="40"
                                            stroke="white"
                                            strokeWidth="3"
                                            className="animate-[dash_2s_linear_infinite]"
                                            strokeDasharray="3 3"
                                        />
                                        <line
                                            x1="-10"
                                            y1="-10"
                                            x2="-10"
                                            y2="10"
                                            stroke="white"
                                            strokeWidth="3"
                                            className="animate-[dash_2s_linear_infinite]"
                                            strokeDasharray="3 3"
                                            style={{ animationDelay: "0.5s" }}
                                        />
                                        <line
                                            x1="10"
                                            y1="-10"
                                            x2="10"
                                            y2="10"
                                            stroke="white"
                                            strokeWidth="3"
                                            className="animate-[dash_2s_linear_infinite]"
                                            strokeDasharray="3 3"
                                            style={{ animationDelay: "1s" }}
                                        />
                                    </g>

                                    {/* People dots representing population */}
                                    <g>
                                        <circle cx="-15" cy="-30" r="4" fill="#ef4444" className="animate-bounce" />
                                        <circle
                                            cx="0"
                                            cy="-30"
                                            r="4"
                                            fill="#10b981"
                                            className="animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        />
                                        <circle
                                            cx="15"
                                            cy="-30"
                                            r="4"
                                            fill="#f59e0b"
                                            className="animate-bounce"
                                            style={{ animationDelay: "0.4s" }}
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>

                {/* Loading text */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">Memuat Data Wilayah Administratif</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Mengambil data dari{" "}
                    <span className="text-foreground font-bold">Sistem Informasi Wilayah Administratif</span>
                    ...
                </p>

                {/* Status dots */}
                <div className="flex gap-2 mt-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                        className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    />
                    <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    />
                </div>
            </div>
        </div>
    );
}
