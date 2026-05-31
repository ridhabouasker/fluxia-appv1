import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', 'pdf-lib'],
  devIndicators: false,
};

export default nextConfig;
