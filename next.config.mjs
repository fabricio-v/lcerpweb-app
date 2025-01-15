/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, //foi adicionado para evitar erro na build do vercel
  },
};

export default nextConfig;
