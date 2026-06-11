/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Next.js strips trailing slashes; Django requires them for POST.
        destination: "http://127.0.0.1:8000/api/:path*/",
      },
    ];
  },
};

export default nextConfig;
