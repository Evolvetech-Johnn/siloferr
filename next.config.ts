import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "siloferr.com.br",
      },
    ],
  },
};

export default nextConfig;
