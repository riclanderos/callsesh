import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.238'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'callsesh.vercel.app',
          },
        ],
        destination: 'https://callsesh.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
