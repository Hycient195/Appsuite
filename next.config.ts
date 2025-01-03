import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://lh3.googleusercontent.com;",
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: "frame-src 'self' https://cdn.builder.io;",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
