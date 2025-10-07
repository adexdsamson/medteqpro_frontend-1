import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/sign-in',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
      },
      {
        protocol: "https",
        hostname: "autogon-omniguard.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
