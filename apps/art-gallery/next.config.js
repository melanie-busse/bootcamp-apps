// WICHTIG: Diese Zeile fehlte, damit Next.js "path" nutzen kann:
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },

  // Aktiviert den hochoptimierten Standalone-Build für Docker
  output: 'standalone',

  // Sagt Next.js, wo das absolute Hauptverzeichnis des Monorepos liegt:
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example-apis.vercel.app",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;