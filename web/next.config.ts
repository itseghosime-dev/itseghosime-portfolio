import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve blocking metadata for crawlers, social previews and automated SEO audits.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|HeadlessChrome|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
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
