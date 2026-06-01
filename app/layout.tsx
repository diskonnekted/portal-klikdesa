import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigationWrapper } from "@/components/layout/MobileNavigationWrapper";
import { CustomToast } from "@/components/ui/custom/CustomToast";
import { BackToTop } from "@/components/ui/custom/BackToTop";
import { PWAInstallPrompt } from "@/components/ui/custom/PWAInstallPrompt";
import { env } from "process";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL || "https://klikdesa-banjarnegara.desa.id"),
    title: "Klikdesa - Dinas Dispermades PPKB Kabupaten Banjarnegara",
    description:
        "Klikdesa (Katalog Layanan Interaktif & Kolaborasi Desa) - Portal resmi Dinas Dispermades PPKB Kabupaten Banjarnegara. Mengintegrasikan layanan kesehatan, pengentasan kemiskinan, pemberdayaan masyarakat, tata kelola, dan ketahanan bencana.",
    keywords:
        "Klikdesa, Dispermades PPKB, Banjarnegara, Jawa Tengah, pelayanan publik, pemberdayaan masyarakat, ketahanan bencana, desil kemiskinan, posyandu",
    authors: [{ name: "Dinas Dispermades PPKB Kabupaten Banjarnegara" }],
    openGraph: {
        title: "Klikdesa - Dinas Dispermades PPKB Banjarnegara",
        description: "Portal resmi Klikdesa untuk Dinas Dispermades PPKB Kabupaten Banjarnegara",
        type: "website",
        locale: "id_ID",
        url: "https://klikdesa-banjarnegara.desa.id",
        siteName: env.APP_NAME || "Klikdesa",
        images: [
            {
                url: "/favicon-512x512.png",
                width: 512,
                height: 512,
                alt: "Klikdesa Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Klikdesa - Dinas Dispermades PPKB Banjarnegara",
        description: "Portal resmi Klikdesa untuk Dinas Dispermades PPKB Kabupaten Banjarnegara",
    },
    other: {
        "msapplication-TileColor": "#FF8A00",
        "msapplication-TileImage": "/favicon-144x144.png",
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "16x16 32x32" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest",
};

export function generateViewport() {
    return {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        themeColor: "#39a2cf",
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1 pt-16 md:pt-28">{children}</main>
                    <Footer />
                </div>
                <MobileNavigationWrapper />
                <CustomToast />
                <BackToTop />
                <PWAInstallPrompt />
            </body>
        </html>
    );
}
