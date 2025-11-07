<script lang="ts">
	import { onMount } from 'svelte';

	let deferredPrompt = $state<any>(null);
	let showPrompt = $state(false);

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showPrompt = true;
		});

		window.addEventListener('appinstalled', () => {
			showPrompt = false;
			deferredPrompt = null;
		});
	});

	async function handleInstall() {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			showPrompt = false;
		}

		deferredPrompt = null;
	}

	function dismiss() {
		showPrompt = false;
	}
</script>

{#if showPrompt}
	<div class="install-prompt">
		<div class="install-content">
			<p class="install-text">Install Pokemon Battle Companion for offline use!</p>
			<div class="install-buttons">
				<button class="install-btn" onclick={handleInstall}>Install</button>
				<button class="dismiss-btn" onclick={dismiss}>Not Now</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.install-prompt {
		position: fixed;
		bottom: 80px;
		left: 0;
		right: 0;
		padding: 0 var(--space-md);
		z-index: 1000;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.install-content {
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		box-shadow: 4px 4px 0 var(--color-text);
		max-width: 600px;
		margin: 0 auto;
	}

	.install-text {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		text-align: center;
		margin: 0 0 var(--space-md) 0;
	}

	.install-buttons {
		display: flex;
		gap: var(--space-sm);
		justify-content: center;
	}

	.install-btn,
	.dismiss-btn {
		font-family: var(--font-heading);
		font-size: 0.625rem;
		text-transform: uppercase;
		padding: var(--space-sm) var(--space-lg);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 3px 3px 0 var(--color-text);
	}

	.install-btn {
		background-color: var(--color-primary);
		color: white;
	}

	.install-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--color-text);
	}

	.dismiss-btn {
		background-color: var(--color-surface);
		color: var(--color-text);
	}

	.dismiss-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--color-text);
	}
</style>
