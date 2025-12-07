/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Optimize production builds
    productionBrowserSourceMaps: false,
    // Enable React compiler optimizations
    experimental: {
        optimizeCss: true,
    },
}

module.exports = nextConfig
