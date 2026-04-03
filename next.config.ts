import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // For Contentful images
      },
      {
        protocol: 'https',
        hostname: 'media.rawg.io',       // For RAWG/NestJS screenshots
      },
    ],
  },
};

export default nextConfig;