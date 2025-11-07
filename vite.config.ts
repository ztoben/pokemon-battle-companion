import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

const base = process.env.BASE_PATH || '';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.png', 'favicon-16.png', 'icon-192.png', 'icon-512.png'],
			manifest: {
				name: 'Pokemon Battle Companion',
				short_name: 'PokeComp',
				description: 'Offline-first Pokemon type effectiveness companion',
				theme_color: '#DC0A2D',
				background_color: '#FFFBF7',
				display: 'standalone',
				start_url: base || '/',
				scope: base || '/',
				icons: [
					{
						src: `${base}/icon-192.png`,
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: `${base}/icon-512.png`,
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'pokeapi-cache',
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 30
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			},
			injectManifest: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}']
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/'
			}
		})
	]
});
