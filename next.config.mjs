import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para next-intl con renderizado dinámico
  // output: 'standalone', // Comentado para permitir renderizado dinámico con next-intl
  
  // Deshabilitar generación estática (app requiere autenticación dinámica)
  experimental: {
    // Permitir que todas las rutas sean dinámicas
  },
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dashboard.igeco.mx',
        pathname: '/**',
      },
    ],
    // Deshabilitar optimización para todas las imágenes (por compatibilidad)
    unoptimized: true,
  },
  
  // Configurar headers de caché para recursos estáticos y seguridad
  async headers() {
    return [
      // CORS para APIs públicas (programa)
      {
        source: '/api/programa/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Permite cualquier origen (cambiar a dominio específico en producción)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      // CORS para API de ponentes (solo lectura)
      {
        source: '/api/ponentes',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
      // CORS para imágenes públicas
      {
        source: '/ponentes/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=120' },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=120' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
