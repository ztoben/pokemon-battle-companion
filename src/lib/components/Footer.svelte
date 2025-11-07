<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<footer class="footer">
	<nav class="nav">
		<a href="{base}/" class="nav-link" class:active={$page.url.pathname === `${base}/`}>Battle</a>
		<a
			href="{base}/chart"
			class="nav-link"
			class:active={$page.url.pathname === `${base}/chart`}
		>
			Type Chart
		</a>
	</nav>
</footer>

<style>
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: var(--color-surface);
		border-top: 3px solid var(--color-text);
		padding: var(--space-md);
		z-index: 100;
	}

	.nav {
		display: flex;
		justify-content: space-around;
		max-width: 600px;
		margin: 0 auto;
	}

	.nav-link {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--color-text);
		padding: var(--space-md) var(--space-lg);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		border: 3px solid var(--color-text);
		background-color: var(--color-surface);
		box-shadow: 3px 3px 0 var(--color-text);
	}

	.nav-link:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--color-text);
	}

	.nav-link:hover {
		background-color: var(--color-background);
	}

	.nav-link.active {
		background-color: var(--color-primary);
		color: white;
	}
</style>
