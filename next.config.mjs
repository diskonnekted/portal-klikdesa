/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        localPatterns: [
            {
                pathname: "/api/takadisa-image",
                search: "?url=*",
            },
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            {
                protocol: 'https',
                hostname: 'sijenggung-banjarnegara.desa.id',
            }
            ,
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
            }
        ],
    },
};

export default nextConfig;
