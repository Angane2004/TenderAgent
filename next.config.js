/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // Disable image optimization for Netlify
        domains: [],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Optimize production builds - NO source maps for smaller bundles
    productionBrowserSourceMaps: false,

    // Security & Performance headers
    poweredByHeader: false,
    compress: true,
    generateEtags: true,

    // Ignore ESLint and TypeScript errors during build
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // Experimental features for better performance
    experimental: {
        optimizeCss: true,
        // Optimize package imports for faster builds
        optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', '@clerk/nextjs'],
        // Aggressive code splitting
        optimizeServerReact: true,
    },

    // Configure caching headers for better performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
