import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar generación estática para rutas con next-intl
  experimental: {
    // Permitir renderizado dinámico
  },
  output: 'standalone'
};

export default withNextIntl(nextConfig);
