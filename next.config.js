/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['together-ai-generated-images.s3.amazonaws.com', 'api.together.ai'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy-image/:path*',
        destination: 'https://api.together.ai/imgproxy/:path*',
      },
    ];
  },
}

module.exports = nextConfig