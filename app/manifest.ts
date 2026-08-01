import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ndalama',
    short_name: 'Ndalama',
    description: 'Mobile money reconciliation for small traders',
    start_url: '/',
    display: 'standalone',
    background_color: '#EDE6D6',
    theme_color: '#1B1812',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
