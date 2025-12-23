"use client";

import React from "react";

import { Logo, LogoSizes, LogoVariant } from "@/components/ui/custom/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LogoDemo() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Logo Component Demo</h1>
                <p className="text-muted-foreground">Various sizes and variants of the Sijenggung logo</p>
            </div>

            {/* Size Variants */}
            <Card>
                <CardHeader>
                    <CardTitle>Size Variants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes.xs} />
                            <Badge variant="outline">XS (16px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes.sm} />
                            <Badge variant="outline">SM (24px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes.md} />
                            <Badge variant="outline">MD (32px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes.lg} />
                            <Badge variant="outline">LG (48px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes.xl} />
                            <Badge variant="outline">XL (64px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes["2xl"]} />
                            <Badge variant="outline">2XL (96px)</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo size={LogoSizes["3xl"]} />
                            <Badge variant="outline">3XL (128px)</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Color Variants */}
            <Card>
                <CardHeader>
                    <CardTitle>Color Variants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="text-center space-y-2">
                            <Logo {...LogoVariant.default} size={LogoSizes.xl} />
                            <Badge variant="outline">Default</Badge>
                        </div>
                        <div className="text-center space-y-2 bg-gray-900 p-4 rounded-lg">
                            <Logo {...LogoVariant.light} size={LogoSizes.xl} />
                            <Badge variant="outline" className="text-white border-white">
                                Light (Dark BG)
                            </Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo {...LogoVariant.monochrome} size={LogoSizes.xl} />
                            <Badge variant="outline">Monochrome</Badge>
                        </div>
                        <div className="text-center space-y-2">
                            <Logo {...LogoVariant.icon} size={LogoSizes.xl} />
                            <Badge variant="outline">Icon Only</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
                <CardHeader>
                    <CardTitle>Common Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Navigation Header */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <Logo {...LogoVariant.nav} />
                        <h3 className="font-semibold">Navigation Header</h3>
                    </div>

                    {/* Page Header */}
                    <div className="text-center space-y-2 p-4 border rounded-lg">
                        <Logo {...LogoVariant.header} />
                        <h3 className="text-xl font-bold">Page Header</h3>
                    </div>

                    {/* Hero Section */}
                    <div className="text-center space-y-4 p-8 bg-gradient-to-br from-[#e6eaf3] to-emerald-100 rounded-lg">
                        <Logo {...LogoVariant.hero} />
                        <h3 className="text-2xl font-bold">Hero Section</h3>
                        <p className="text-muted-foreground">Large logo for landing pages</p>
                    </div>

                    {/* Responsive */}
                    <div className="w-full p-4 border rounded-lg">
                        <Logo {...LogoVariant.responsive} />
                        <p className="text-center text-sm text-muted-foreground mt-2">Responsive (100% width)</p>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Examples */}
            <Card>
                <CardHeader>
                    <CardTitle>Custom Examples</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center space-y-2 p-4 bg-red-50 rounded-lg">
                            <Logo size={64} variant="monochrome" className="opacity-80" />
                            <Badge variant="destructive">Custom Styling</Badge>
                        </div>
                        <div className="text-center space-y-2 p-4 bg-blue-50 rounded-lg">
                            <Logo size={80} variant="default" className="rotate-12" />
                            <Badge className="bg-blue-500">Rotated</Badge>
                        </div>
                        <div className="text-center space-y-2 p-4 bg-purple-50 rounded-lg">
                            <Logo size={56} showBackground={false} className="text-purple-600" />
                            <Badge className="bg-purple-500">Icon Only</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Code */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Basic Usage:</h4>
                        <code className="text-sm">
                            {`import { Logo, LogoSizes, LogoVariant } from '@/components/ui/custom/Logo';

// Default logo
<Logo />

// Specific size
<Logo size={64} />

// Using preset sizes
<Logo size={LogoSizes.lg} />

// Using variants
<Logo {...LogoVariant.header} />

// Custom styling
<Logo size={48} className="shadow-lg" />`}
                        </code>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
