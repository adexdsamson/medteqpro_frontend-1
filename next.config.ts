import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/sign-in',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
