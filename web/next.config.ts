import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./sanity/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/s3e4rrk9/production/**",
      },
    ],
  },
};

export default nextConfig;
