/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'f0cddb830e2e20787c618e4a9a0f7dc7.cdn.bubble.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.promoopcion.com',
        port: '',
        pathname: '/media/catalog/product/**',
      },
    ],
  },
}

module.exports = nextConfig
