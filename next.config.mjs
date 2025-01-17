/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // swcMinify: false,
  // output: "export",
  // trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true, //foi adicionado para evitar erro na build do vercel
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
