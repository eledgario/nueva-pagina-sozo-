/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.moplayeras.com',
        port: '',
        pathname: '/cdn/shop/products/**',
      },
    ],
  },
}

module.exports = nextConfig
