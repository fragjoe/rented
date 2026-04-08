import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prevent Turbopack from bundling Node.js packages into client
  serverExternalPackages: ['tailwindcss'],
}
