import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Skip ESLint errors during `next build`
  },
  // Add any other config options here
};

export default nextConfig;
