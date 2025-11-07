<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	onMount(() => {
		const hasNavigated = sessionStorage.getItem('hasNavigated');
		const currentPath = window.location.pathname;
		const lastPage = localStorage.getItem('lastPage');

		if (!hasNavigated && lastPage && lastPage !== '/') {
			const basePath = import.meta.env.BASE_URL || '';
			const isHome = currentPath === '/' || currentPath === `${basePath}/`;

			if (isHome) {
				goto(lastPage);
			}
		}

		sessionStorage.setItem('hasNavigated', 'true');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
