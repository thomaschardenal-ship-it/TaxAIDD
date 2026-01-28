/** @type {import('next').NextConfig} */

// Detect deployment target
const isVercel = process.env.VERCEL === '1';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,

  // GitHub Pages: static export with basePath
  // Vercel: server-side with API routes
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/TaxAIDD',
  }),

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
