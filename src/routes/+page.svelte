<script lang="ts">
	import { onMount } from 'svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		getSuperEffectiveTypes,
		getNotVeryEffectiveTypes,
		getNoEffectTypes,
		calculateEffectiveness
	} from '$lib/data/type-chart';
	import type { Pokemon } from '$lib/types/pokemon';
	import { pokeapi } from '$lib/services/pokeapi';

	let searchQuery = $state('');
	let selectedPokemon = $state<Pokemon | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	let allPokemon = $state<Array<{ id: number; name: string }>>([]);
	let filteredPokemon = $state<Array<{ id: number; name: string }>>([]);

	let superEffectiveWithMultipliers = $derived(
		selectedPokemon
			? (() => {
					const types = selectedPokemon.types;
					return getSuperEffectiveTypes(types)
						.map((type) => ({
							type,
							multiplier: calculateEffectiveness(type, types)
						}))
						.sort((a, b) => b.multiplier - a.multiplier);
				})()
			: []
	);

	let notVeryEffective = $derived(
		selectedPokemon
			? (() => {
					const types = selectedPokemon.types;
					return getNotVeryEffectiveTypes(types).map((type) => ({
						type,
						multiplier: calculateEffectiveness(type, types)
					}));
				})()
			: []
	);

	let noEffect = $derived(
		selectedPokemon
			? getNoEffectTypes(selectedPokemon.types).map((type) => ({ type, multiplier: 0 }))
			: []
	);

	onMount(async () => {
		localStorage.setItem('lastPage', '/');

		await pokeapi.init();
		allPokemon = await pokeapi.getAllPokemonNames();
	});

	async function handleSelect(option: { id: number; name: string }) {
		loading = true;
		error = null;
		selectedPokemon = null;

		try {
			const pokemon = await pokeapi.getPokemon(option.id);

			if (pokemon) {
				selectedPokemon = pokemon;
			} else {
				error = 'Pokemon not found';
			}
		} catch (err) {
			console.error('Search error:', err);
			error = 'Failed to load Pokemon';
		} finally {
			loading = false;
		}
	}

	function handleInput(value: string) {
		if (!value || value.length < 1) {
			filteredPokemon = [];
			return;
		}

		const query = value.toLowerCase();

		filteredPokemon = allPokemon
			.filter((p) => p.name.includes(query) || p.id.toString().includes(query))
			.slice(0, 10);
	}

	function formatName(name: string): string {
		return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
	}

	function formatId(id: number): string {
		return `#${id.toString().padStart(4, '0')}`;
	}

	function clearSearch() {
		searchQuery = '';
		selectedPokemon = null;
		error = null;
		filteredPokemon = [];
	}
</script>

<svelte:head>
	<title>Pokemon Battle Companion</title>
	<meta name="description" content="Find what types are effective against any Pokemon" />
</svelte:head>

<div class="container">
	<header class="header">
		<h1>Battle Helper</h1>
	</header>

	<main class="battle-helper">
		<!-- Instructions -->
		{#if !selectedPokemon && !loading && !error}
			<div class="instructions">
				<p>Start typing: pikachu, charizard, 25...</p>
			</div>
		{/if}

		<!-- Search Section -->
		{#if !selectedPokemon}
			<div class="search-container">
				<Autocomplete
					bind:value={searchQuery}
					options={filteredPokemon}
					placeholder="Search Pokemon..."
					onselect={handleSelect}
					oninput={handleInput}
					{loading}
				/>

				{#if error}
					<p class="error-message">{error}</p>
				{/if}
			</div>
		{/if}

		<!-- Results Section -->
		{#if selectedPokemon}
			<section class="pokemon-display">
				<div class="pokemon-header">
					<div class="pokemon-info">
						<h2>{formatName(selectedPokemon.name)}</h2>
						<span class="pokemon-id">{formatId(selectedPokemon.id)}</span>
					</div>
					<button class="clear-btn-small" onclick={clearSearch}>×</button>
				</div>

				<div class="pokemon-sprite-container">
					<img src={selectedPokemon.sprite} alt={selectedPokemon.name} class="pokemon-sprite" />
				</div>

				<div class="pokemon-types">
					{#each selectedPokemon.types as type (type)}
						<TypeBadge {type} size="lg" />
					{/each}
				</div>
			</section>

			<!-- Super Effective Section -->
			{#if superEffectiveWithMultipliers.length > 0}
				<section class="effectiveness-section super">
					<h3>Super Effective</h3>
					<div class="types-grid">
						{#each superEffectiveWithMultipliers as { type, multiplier } (type)}
							<TypeBadge {type} size="md" {multiplier} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- Not Very Effective Section -->
			{#if notVeryEffective.length > 0}
				<section class="effectiveness-section resist">
					<h3>Not Very Effective</h3>
					<div class="types-grid">
						{#each notVeryEffective as { type, multiplier } (type)}
							<TypeBadge {type} size="sm" {multiplier} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- No Effect Section -->
			{#if noEffect.length > 0}
				<section class="effectiveness-section immune">
					<h3>No Effect</h3>
					<div class="types-grid">
						{#each noEffect as { type, multiplier } (type)}
							<TypeBadge {type} size="sm" {multiplier} />
						{/each}
					</div>
				</section>
			{/if}
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

	.battle-helper {
		padding-bottom: 100px;
	}

	.search-container {
		margin-bottom: var(--space-xl);
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.error-message {
		text-align: center;
		color: var(--color-primary);
		margin-top: var(--space-md);
		font-size: 1rem;
	}

	.pokemon-display {
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		margin-bottom: var(--space-lg);
		box-shadow: 4px 4px 0 var(--color-text);
	}

	.pokemon-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-md);
	}

	.pokemon-info h2 {
		margin: 0 0 var(--space-xs) 0;
	}

	.pokemon-id {
		font-family: var(--font-heading);
		font-size: 0.625rem;
		color: var(--color-text-light);
	}

	.clear-btn-small {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		background: none;
		border: none;
		color: var(--color-text-light);
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		line-height: 1;
	}

	.clear-btn-small:hover {
		color: var(--color-primary);
	}

	.pokemon-sprite-container {
		text-align: center;
		margin: var(--space-md) 0;
	}

	.pokemon-sprite {
		width: 150px;
		height: 150px;
		object-fit: contain;
		image-rendering: pixelated;
		background-color: var(--color-background);
		border-radius: var(--radius-md);
		border: 2px solid var(--color-border);
		padding: var(--space-sm);
	}

	.pokemon-types {
		display: flex;
		gap: var(--space-sm);
		justify-content: center;
	}

	.effectiveness-section {
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		margin-bottom: var(--space-lg);
		box-shadow: 4px 4px 0 var(--color-text);
	}

	.effectiveness-section.super {
		border-color: #78c850;
		box-shadow: 4px 4px 0 #5a9a3c;
	}

	.effectiveness-section.resist {
		border-color: #6890f0;
		box-shadow: 4px 4px 0 #4a70c0;
	}

	.effectiveness-section.immune {
		border-color: var(--color-text-light);
		box-shadow: 4px 4px 0 #999;
	}

	.effectiveness-section h3 {
		text-align: center;
		margin-bottom: var(--space-md);
	}

	.types-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
	}

	.instructions {
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.instructions p {
		color: var(--color-text-light);
		font-size: 1rem;
		margin: 0;
	}

	@media (min-width: 768px) {
		.pokemon-sprite {
			width: 200px;
			height: 200px;
		}
	}
</style>
