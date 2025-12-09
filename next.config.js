/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
        formats: ['image/avif', 'image/webp'],
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Optimize production builds
    productionBrowserSourceMaps: false,
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
        optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
    },
    // Enable SWC minification for faster builds
    swcMinify: true,
}

module.exports = nextConfig
