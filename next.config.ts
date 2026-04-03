import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.238'],

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
