"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PembangunanDataNotAvailableProps {
    onRetry?: () => void;
    className?: string;
}

export function PembangunanDataNotAvailable({ onRetry, className }: PembangunanDataNotAvailableProps) {
    return (
        <div className={cn("flex items-center justify-center py-12", className)}>
            <Card className="max-w-lg w-full border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-12 px-8">
                    {/* Animated SVG Illustration */}
                    <div className="relative mb-6">
                        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
                            {/* Background circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="2"
                                className="animate-pulse"
                            />

                            {/* Outer rotating ring */}
                            <circle
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                                strokeDasharray="10 5"
                                className="animate-spin"
                                style={{ animationDuration: "20s" }}
                            />

                            {/* Hammer icon */}
                            <g transform="translate(100, 100)">
                                {/* Server base */}
                                <ellipse
                                    cx="0"
                                    cy="25"
                                    rx="40"
                                    ry="12"
                                    fill="#e5e7eb"
                                    className="animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                {/* Server middle */}
                                <rect x="-40" y="-5" width="80" height="30" rx="6" fill="#d1d5db" />
                                {/* Server top */}
                                <rect x="-40" y="-35" width="80" height="30" rx="6" fill="#cbd5e1" />

                                {/* LED indicators - blinking */}
                                <circle
                                    cx="-25"
                                    cy="-20"
                                    r="3"
                                    fill="#ef4444"
                                    className="animate-ping"
                                    style={{ animationDuration: "1s" }}
                                />
                                <circle
                                    cx="-15"
                                    cy="-20"
                                    r="3"
                                    fill="#fbbf24"
                                    className="animate-ping"
                                    style={{ animationDuration: "1.5s" }}
                                />
                                <circle
                                    cx="-5"
                                    cy="-20"
                                    r="3"
                                    fill="#10b981"
                                    className="animate-ping"
                                    style={{ animationDuration: "2s" }}
                                />

                                {/* Lock overlay for unavailable data */}
                                <g transform="translate(0, 0)">
                                    <rect
                                        x="-15"
                                        y="-55"
                                        width="30"
                                        height="25"
                                        rx="4"
                                        fill="#ef4444"
                                        className="drop-shadow-md"
                                    />
                                    <path
                                        d="M -10 -55 C -10 -65, -5 -70, 0 -70 C 5 -70, 10 -65, 10 -55"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="3"
                                    />
                                    <circle cx="0" cy="-45" r="3" fill="white" />
                                </g>
                            </g>
                        </svg>
                    </div>

                    {/* Error message */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                        Data Pembangunan Belum Tersedia
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                        Data pembangunan belum tersedia atau sedang dalam proses pengumpulan.
                    </p>
                    <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                        Silakan coba lagi nanti atau hubungi pihak Desa.
                    </p>

                    {/* Action buttons */}
                    {onRetry && (
                        <div className="flex gap-3">
                            <Button onClick={onRetry} variant="default" size="sm" className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Coba Lagi
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

