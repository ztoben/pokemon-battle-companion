<script lang="ts">
	import { onMount } from 'svelte';
	import {
		TYPES,
		type PokemonType,
		getOffensiveSuperEffective,
		getOffensiveNotVeryEffective,
		getOffensiveNoEffect,
		getSuperEffectiveTypes,
		getNotVeryEffectiveTypes,
		getNoEffectTypes
	} from '$lib/data/type-chart';
	import { getTypeColor, getTypeOutlineColor } from '$lib/data/type-colors';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import Footer from '$lib/components/Footer.svelte';

	type ViewMode = 'defending' | 'attacking';

	let selectedType = $state<PokemonType | null>(null);
	let viewMode = $state<ViewMode>('defending');

	// Defensive matchups (what's good against this type)
	let defensiveWeaknesses = $derived(selectedType ? getSuperEffectiveTypes([selectedType]) : []);
	let defensiveResistances = $derived(selectedType ? getNotVeryEffectiveTypes([selectedType]) : []);
	let defensiveImmunities = $derived(selectedType ? getNoEffectTypes([selectedType]) : []);

	// Offensive matchups (what this type is good against)
	let offensiveStrengths = $derived(selectedType ? getOffensiveSuperEffective([selectedType]) : []);
	let offensiveWeaknesses = $derived(
		selectedType ? getOffensiveNotVeryEffective([selectedType]) : []
	);
	let offensiveImmunities = $derived(selectedType ? getOffensiveNoEffect([selectedType]) : []);

	onMount(() => {
		localStorage.setItem('lastPage', '/chart');

		const savedViewMode = localStorage.getItem('typeChartViewMode') as ViewMode;
		if (savedViewMode === 'defending' || savedViewMode === 'attacking') {
			viewMode = savedViewMode;
		}

		const savedType = localStorage.getItem('selectedType') as PokemonType;
		if (savedType && TYPES.includes(savedType)) {
			selectedType = savedType;
		}
	});

	function selectType(type: PokemonType) {
		if (selectedType === type) {
			selectedType = null;
			localStorage.removeItem('selectedType');
		} else {
			selectedType = type;
			localStorage.setItem('selectedType', type);
		}
	}

	function setViewMode(mode: ViewMode) {
		viewMode = mode;
		localStorage.setItem('typeChartViewMode', mode);
	}
</script>

<svelte:head>
	<title>Types - Pokemon Battle Companion</title>
	<meta name="description" content="Complete Pokemon type effectiveness reference" />
</svelte:head>

<div class="container">
	<header class="header">
		<h1>Type Reference</h1>
	</header>

	<main class="chart-container">
		<div class="instructions">
			<p>Tap a type to see its effectiveness</p>
		</div>

		<div class="types-legend">
			{#each TYPES as type (type)}
				<button
					class="type-chip"
					class:selected={selectedType === type}
					style:background-color={getTypeColor(type)}
					style:--outline-color={getTypeOutlineColor(type)}
					onclick={() => selectType(type)}
				>
					{type}
				</button>
			{/each}
		</div>

		{#if selectedType}
			<!-- Tab Panel -->
			<div class="tab-panel">
				<button
					class="tab-button"
					class:active={viewMode === 'defending'}
					onclick={() => setViewMode('defending')}
				>
					Defending
				</button>
				<button
					class="tab-button"
					class:active={viewMode === 'attacking'}
					onclick={() => setViewMode('attacking')}
				>
					Attacking
				</button>
			</div>

			{#if viewMode === 'defending'}
				<!-- Defensive Section -->
				{#if defensiveWeaknesses.length > 0}
					<section class="matchup-section super">
						<h3>Weak To (2x)</h3>
						<div class="types-grid">
							{#each defensiveWeaknesses as type (type)}
								<TypeBadge {type} size="md" />
							{/each}
						</div>
					</section>
				{/if}

				{#if defensiveResistances.length > 0}
					<section class="matchup-section resist">
						<h3>Resists (½x)</h3>
						<div class="types-grid">
							{#each defensiveResistances as type (type)}
								<TypeBadge {type} size="sm" />
							{/each}
						</div>
					</section>
				{/if}

				{#if defensiveImmunities.length > 0}
					<section class="matchup-section immune">
						<h3>Immune To (0x)</h3>
						<div class="types-grid">
							{#each defensiveImmunities as type (type)}
								<TypeBadge {type} size="sm" />
							{/each}
						</div>
					</section>
				{/if}
			{:else}
				<!-- Offensive Section -->
				{#if offensiveStrengths.length > 0}
					<section class="matchup-section super">
						<h3>Strong Against (2x)</h3>
						<div class="types-grid">
							{#each offensiveStrengths as type (type)}
								<TypeBadge {type} size="md" />
							{/each}
						</div>
					</section>
				{/if}

				{#if offensiveWeaknesses.length > 0}
					<section class="matchup-section resist">
						<h3>Weak Against (½x)</h3>
						<div class="types-grid">
							{#each offensiveWeaknesses as type (type)}
								<TypeBadge {type} size="sm" />
							{/each}
						</div>
					</section>
				{/if}

				{#if offensiveImmunities.length > 0}
					<section class="matchup-section immune">
						<h3>Can't Hit (0x)</h3>
						<div class="types-grid">
							{#each offensiveImmunities as type (type)}
								<TypeBadge {type} size="sm" />
							{/each}
						</div>
					</section>
				{/if}
			{/if}
		{:else}
			<div class="empty-prompt">
				<p>Select a type to view its effectiveness</p>
			</div>
		{/if}
	</main>

	<Footer />
</div>

<style>
	.header {
		text-align: center;
		padding: var(--space-xl) 0 var(--space-sm);
		border-bottom: 3px solid var(--color-text);
		margin-bottom: var(--space-md);
	}

	.chart-container {
		padding-bottom: 100px;
	}

	.instructions {
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.instructions p {
		color: var(--color-text-light);
		font-size: 1rem;
	}

	.types-legend {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-xs);
		margin-bottom: var(--space-xl);
	}

	@media (min-width: 480px) {
		.types-legend {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 768px) {
		.types-legend {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-sm);
		}
	}

	@media (min-width: 1024px) {
		.types-legend {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	.type-chip {
		font-family: var(--font-heading);
		font-size: 0.625rem;
		text-transform: uppercase;
		padding: var(--space-sm) var(--space-md);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		color: white;
		text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
		box-shadow: 3px 3px 0 var(--color-text);
	}

	.type-chip:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--color-text);
	}

	.type-chip.selected {
		box-shadow:
			inset 0 0 0 3px var(--outline-color),
			3px 3px 0 var(--color-text);
	}

	.tab-panel {
		display: flex;
		gap: var(--space-sm);
		margin: var(--space-xl) 0 var(--space-lg);
		justify-content: center;
	}

	.tab-button {
		font-family: var(--font-heading);
		font-size: 0.625rem;
		text-transform: uppercase;
		padding: var(--space-sm) var(--space-lg);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-sm);
		background-color: var(--color-surface);
		color: var(--color-text);
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 3px 3px 0 var(--color-text);
		flex: 1;
		max-width: 150px;
	}

	.tab-button:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--color-text);
	}

	.tab-button.active {
		background-color: var(--color-primary);
		color: white;
		box-shadow:
			inset 0 0 0 2px var(--color-primary-dark),
			3px 3px 0 var(--color-text);
	}

	.tab-button.active:active {
		box-shadow:
			inset 0 0 0 2px var(--color-primary-dark),
			1px 1px 0 var(--color-text);
	}

	.matchup-section {
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		margin-bottom: var(--space-lg);
		box-shadow: 4px 4px 0 var(--color-text);
	}

	.matchup-section.super {
		border-color: #78c850;
		box-shadow: 4px 4px 0 #5a9a3c;
	}

	.matchup-section.resist {
		border-color: #6890f0;
		box-shadow: 4px 4px 0 #4a70c0;
	}

	.matchup-section.immune {
		border-color: var(--color-text-light);
		box-shadow: 4px 4px 0 #999;
	}

	.matchup-section h3 {
		text-align: center;
		margin-bottom: var(--space-md);
	}

	.types-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
	}

	.empty-prompt {
		text-align: center;
		padding: var(--space-2xl);
		color: var(--color-text-light);
	}
</style>
