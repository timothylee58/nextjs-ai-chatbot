import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Defines the core settings for the Next.js 16 application (App Router + Turbopack).
 * Currently only configures allowed remote image domains for next/image optimization.
 */
const nextConfig: NextConfig = {
  images: {
    // Whitelist external image hosts so <Image> can optimize them
    remotePatterns: [
      {
        // Vercel-generated avatar images (used for user profile pictures)
        hostname: "avatar.vercel.sh",
      },
      {
        // Vercel Blob storage (user-uploaded files like attachments/images)
        protocol: "https",
        //https://nextjs.org/docs/messages/next-image-unconfigured-host
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
