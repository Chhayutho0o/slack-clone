/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "expert-rabbit-444.convex.cloud",
      },
      {
        hostname: "useful-goose-939.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
