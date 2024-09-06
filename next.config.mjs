/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "expert-rabbit-444.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
