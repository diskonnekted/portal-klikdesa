"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // Check if already installed
        const checkStandalone = () => {
            setIsStandalone(
                window.matchMedia("(display-mode: standalone)").matches ||
                    (window.navigator as { standalone?: boolean }).standalone ||
                    document.referrer.includes("android-app://")
            );
        };

        // Check if iOS device
        const checkIOS = () => {
            setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream);
        };

        // Listen for beforeinstallprompt event (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        // Listen for appinstalled event
        const handleAppInstalled = () => {
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        // Initial checks
        checkStandalone();
        checkIOS();

        // Add event listeners
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        // Show iOS install prompt after delay
        if (isIOS && !isStandalone) {
            const timer = setTimeout(() => {
                setShowInstallPrompt(true);
            }, 5000); // Show after 5 seconds
            return () => clearTimeout(timer);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, [isIOS, isStandalone]);

    const handleInstallClick = async () => {
        if (deferredPrompt && !isIOS) {
            // Android/Chrome installation
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setShowInstallPrompt(false);
            }
        } else {
            // For iOS, hide the prompt and let user install manually
            setShowInstallPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        // Store dismissal in localStorage
        localStorage.setItem("pwa-install-dismissed", "true");
    };

    // Don't show if already installed or previously dismissed
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if previously dismissed in localStorage
        if (typeof window !== "undefined") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsDismissed(localStorage.getItem("pwa-install-dismissed") === "true");
        }
    }, []);

    if (isStandalone || isDismissed) {
        return null;
    }

    if (!showInstallPrompt) {
        return null;
    }

    return (
        <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 shadow-lg animate-in slide-in-from-bottom duration-300">
            <CardContent className="p-4">
                <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground">Install Portal Sijenggung</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isIOS ? (
                                    <>
                                        Pasang aplikasi di iPhone Anda: Tap{" "}
                                        <span className="font-medium">
                                            Share <span className="inline-block">⎋</span>
                                        </span>{" "}
                                        lalu{" "}
                                        <span className="font-medium">
                                            Add to Home Screen <span className="inline-block">➕</span>
                                        </span>
                                    </>
                                ) : (
                                    "Install aplikasi untuk akses cepat dan notifikasi"
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {!isIOS && (
                            <Button size="sm" onClick={handleInstallClick} className="hidden md:flex">
                                <Download className="w-3 h-3 mr-1" />
                                Install
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {!isIOS && (
                    <div className="mt-3 pt-3 border-t border-border">
                        <Button size="sm" onClick={handleInstallClick} className="w-full md:hidden">
                            <Download className="w-3 h-3 mr-1" />
                            Install Portal Sijenggung
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
