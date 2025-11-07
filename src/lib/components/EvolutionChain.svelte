<script lang="ts">
	import type { EvolutionChainMember } from '$lib/types/pokemon';

	interface Props {
		chain: EvolutionChainMember[];
		currentPokemonId: number;
	}

	let { chain, currentPokemonId }: Props = $props();

	function formatName(name: string): string {
		return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
	}
</script>

{#if chain && chain.length > 1}
	<section class="evolution-section">
		<h3>Evolution Chain</h3>
		<div class="evolution-timeline">
			{#each chain as member, index (member.id)}
				<div class="evolution-stage" class:current={member.id === currentPokemonId}>
					<div class="evolution-sprite-container">
						<img src={member.sprite} alt={member.name} class="evolution-sprite" />
					</div>
					<p class="evolution-name">{formatName(member.name)}</p>
					{#if member.evolutionTrigger}
						<p class="evolution-trigger">{member.evolutionTrigger}</p>
					{/if}
				</div>

				{#if index < chain.length - 1}
					<div class="evolution-arrow">→</div>
				{/if}
			{/each}
		</div>
	</section>
{/if}

<style>
	.evolution-section {
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		margin-bottom: var(--space-lg);
		box-shadow: 4px 4px 0 var(--color-text);
	}

	.evolution-section h3 {
		text-align: center;
		margin-bottom: var(--space-md);
	}

	.evolution-timeline {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.evolution-stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		min-width: 120px;
	}

	.evolution-stage.current {
		background-color: var(--color-accent);
		border: 2px solid var(--color-text);
		box-shadow: 0 0 0 4px var(--color-accent);
	}

	.evolution-sprite-container {
		width: 96px;
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-background);
		border-radius: var(--radius-sm);
		border: 2px solid var(--color-border);
	}

	.evolution-sprite {
		width: 80px;
		height: 80px;
		object-fit: contain;
		image-rendering: pixelated;
	}

	.evolution-name {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		text-align: center;
		margin: 0;
		color: var(--color-text);
	}

	.evolution-trigger {
		font-size: 0.75rem;
		text-align: center;
		margin: 0;
		color: var(--color-text-light);
		font-style: italic;
		max-width: 140px;
		line-height: 1.2;
	}

	.evolution-arrow {
		font-size: 2rem;
		color: var(--color-text);
		font-weight: bold;
		margin: 0 var(--space-sm);
	}

	@media (max-width: 600px) {
		.evolution-timeline {
			flex-direction: column;
		}

		.evolution-arrow {
			transform: rotate(90deg);
			margin: var(--space-xs) 0;
		}

		.evolution-stage {
			width: 100%;
			max-width: 200px;
		}
	}
</style>
