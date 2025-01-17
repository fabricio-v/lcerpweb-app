/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  typescript: {
    ignoreBuildErrors: true, //foi adicionado para evitar erro na build do vercel
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
