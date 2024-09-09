/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // This line will disable ESLint during production builds
  },
};

export default nextConfig;
