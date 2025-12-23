"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WilayahDataNotAvailableProps {
    onRetry?: () => void;
    className?: string;
}

export function WilayahDataNotAvailable({ onRetry, className }: WilayahDataNotAvailableProps) {
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

                            {/* Map pin icon */}
                            <g transform="translate(100, 100)">
                                {/* Map structure base */}
                                <ellipse
                                    cx="0"
                                    cy="25"
                                    rx="40"
                                    ry="12"
                                    fill="#e5e7eb"
                                    className="animate-[pulse_2s_ease-in-out_infinite]"
                                />

                                {/* Map structure middle */}
                                <rect x="-40" y="-5" width="80" height="30" rx="6" fill="#d1d5db" />

                                {/* Map structure top */}
                                <rect x="-40" y="-35" width="80" height="30" rx="6" fill="#cbd5e1" />

                                {/* Map pin marker */}
                                <g transform="translate(0, -20)">
                                    <path
                                        d="M 0 -25 C -15 -25, -25 -15, -25 0 C -25 10, -15 20, 0 35 C 15 20, 25 10, 25 0 C 25 -15, 15 -25, 0 -25 Z"
                                        fill="#ef4444"
                                        className="drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]"
                                    />
                                    <circle cx="0" cy="-5" r="6" fill="white" />
                                    <circle cx="0" cy="-5" r="4" fill="#ef4444" />
                                </g>

                                {/* Grid lines to represent administrative divisions */}
                                <g className="opacity-30">
                                    <line
                                        x1="-25"
                                        y1="5"
                                        x2="25"
                                        y2="5"
                                        stroke="#9ca3af"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                    <line
                                        x1="-25"
                                        y1="15"
                                        x2="25"
                                        y2="15"
                                        stroke="#9ca3af"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                    <line
                                        x1="-15"
                                        y1="-5"
                                        x2="-15"
                                        y2="25"
                                        stroke="#9ca3af"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                    <line
                                        x1="0"
                                        y1="-5"
                                        x2="0"
                                        y2="25"
                                        stroke="#9ca3af"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                    <line
                                        x1="15"
                                        y1="-5"
                                        x2="15"
                                        y2="25"
                                        stroke="#9ca3af"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                </g>
                            </g>
                        </svg>
                    </div>

                    {/* Error message */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                        Data Wilayah Administratif Belum Tersedia
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                        Data wilayah administratif belum tersedia atau sedang dalam proses pengumpulan.
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

