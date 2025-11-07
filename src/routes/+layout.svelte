<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	onMount(() => {
		// Only redirect on fresh app open (not on navigation within the session)
		const hasNavigated = sessionStorage.getItem('hasNavigated');
		const currentPath = window.location.pathname;
		const lastPage = localStorage.getItem('lastPage');

		if (!hasNavigated && currentPath === '/' && lastPage && lastPage !== '/') {
			// This is a fresh app open, redirect to last page
			goto(lastPage);
		}

		// Mark that we've navigated at least once in this session
		sessionStorage.setItem('hasNavigated', 'true');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
