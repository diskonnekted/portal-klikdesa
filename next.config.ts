import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    cacheComponents: true,
    poweredByHeader: false,

    allowedDevOrigins: ['*.clasnet.co.id'],

    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        qualities: [25, 50, 75, 90],

        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/media/**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/media/**',
            },
            {
                protocol: 'http',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/artikel/**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/artikel/**',
            },
            {
                protocol: 'http',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/storage-desa**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/storage-desa**',
            },
            {
                protocol: 'http',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/galeri/**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/galeri/**',
            },
            {
                protocol: 'http',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/pembangunan/**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
                port: '',
                pathname: '/desa/upload/pembangunan/**',
            },
            {
                protocol: 'https',
                hostname: 'static.bmkg.go.id',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung.smartdesa.net',
                port: '',
                pathname: '/uploads/**',
            },
        ],

        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        minimumCacheTTL: 60,
    },

    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'simple-icons'],
    }
};

export default nextConfig;
