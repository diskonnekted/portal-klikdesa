import type { MetadataRoute } from "next";
import { env } from "process";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: env.APP_NAME || "Portal Desa Sijenggung",
        short_name: "Sijenggung",
        description:
            "Portal resmi Pemerintah Desa Sijenggung, Kabupaten Banjarnegara, Jawa Tengah. Informasi lengkap layanan publik, berita terkini, dan transparansi pemerintahan desa.",
        start_url: "/",
        display: "standalone",
        background_color: "#F9F9F9",
        theme_color: "#FF8A00",
        orientation: "portrait-primary",
        scope: "/",
        categories: ["government", "public services", "community"],
        lang: "id-ID",
        dir: "ltr",
        icons: [
            {
                src: "/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/favicon-96x96.png",
                sizes: "96x96",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/favicon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/favicon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
        ],
        shortcuts: [
            {
                name: "Berita",
                short_name: "Berita",
                description: "Baca berita terkini desa",
                url: "/berita",
                icons: [{ src: "/favicon-96x96.png", sizes: "96x96" }],
            },
            {
                name: "Pengumuman",
                short_name: "Pengumuman",
                description: "Baca pengumuman terkini desa",
                url: "/pengumuman",
                icons: [{ src: "/favicon-96x96.png", sizes: "96x96" }],
            },
            {
                name: "Pengaduan",
                short_name: "Pengaduan",
                description: "Hubungi pemerintah desa",
                url: "/pengaduan",
                icons: [{ src: "/favicon-96x96.png", sizes: "96x96" }],
            },
        ],
        screenshots: [
            {
                src: "/images/home-desktop.png",
                sizes: "1280x720",
                type: "image/png",
                form_factor: "wide",
                label: "Homepage " + (env.APP_NAME || "Portal Desa Sijenggung"),
            },
            {
                src: "/images/home-mobile.png",
                sizes: "390x844",
                type: "image/png",
                form_factor: "narrow",
                label: "Tampilan Mobile " + (env.APP_NAME || "Portal Desa Sijenggung"),
            },
        ],
        related_applications: [],
        prefer_related_applications: false,
    };
}
