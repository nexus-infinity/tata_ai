/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'canvas'],
  },
  images: {
    domains: ['placeholder.com'],
  },
  // Configure rewrites to proxy API requests to your backend services
  async rewrites() {
    return [
      {
        source: '/api/core/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/core/:path*',
      },
      {
        source: '/api/flow/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/flow/:path*',
      },
      {
        source: '/api/memex/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/memex/:path*',
      },
      {
        source: '/api/zkp/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/zkp/:path*',
      },
    ];
  },
};

export default nextConfig;