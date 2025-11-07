import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html',
			strict: false
		}),
		paths: {
			base: dev ? '' : process.env.BASE_PATH
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
