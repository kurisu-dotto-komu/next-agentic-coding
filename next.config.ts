import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    dirs: ["app", "components", "lib", "convex", "tests"],
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
