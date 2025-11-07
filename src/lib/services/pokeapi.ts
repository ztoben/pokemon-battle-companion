import type { PokemonType } from '$lib/data/type-chart';
import type {
	Pokemon,
	PokeAPIResponse,
	PokemonListItem,
	PokemonSpecies,
	CachedPokemon
} from '$lib/types/pokemon';
import { indexedDB } from './indexeddb';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * PokeAPI service with IndexedDB caching
 */
class PokeAPIService {
	private isInitialized = false;

	/**
	 * Initialize the service and IndexedDB
	 */
	async init(): Promise<void> {
		if (this.isInitialized) return;

		try {
			await indexedDB.init();
			this.isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize PokeAPI service:', error);
		}
	}

	/**
	 * Transform PokeAPI response to our Pokemon interface
	 */
	private transformPokemon(data: PokeAPIResponse): Pokemon {
		const types = data.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name as PokemonType);

		const sprite =
			data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;

		return {
			id: data.id,
			name: data.name,
			types,
			sprite,
			height: data.height,
			weight: data.weight,
			stats: {
				hp: data.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
				attack: data.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
				defense: data.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
				specialAttack: data.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0,
				specialDefense: data.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0,
				speed: data.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0
			},
			species_url: data.species.url
		};
	}

	/**
	 * Fetch a Pokemon by ID or name
	 */
	async getPokemon(idOrName: string | number): Promise<Pokemon | null> {
		await this.init();

		try {
			// Check cache first
			const cachedPokemon =
				typeof idOrName === 'number'
					? await indexedDB.getPokemon(idOrName)
					: await indexedDB.getPokemonByName(idOrName.toString());

			// Return cached data if it's still fresh
			if (cachedPokemon && Date.now() - cachedPokemon.cachedAt < CACHE_DURATION) {
				return cachedPokemon;
			}

			// Fetch from API
			const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);

			if (!response.ok) {
				console.error(`Failed to fetch Pokemon ${idOrName}: ${response.status}`);
				return null;
			}

			const data: PokeAPIResponse = await response.json();
			const pokemon = this.transformPokemon(data);

			// Cache the result
			const cachedData: CachedPokemon = {
				...pokemon,
				cachedAt: Date.now()
			};
			await indexedDB.savePokemon(cachedData);

			return pokemon;
		} catch (error) {
			console.error(`Error fetching Pokemon ${idOrName}:`, error);

			// Return stale cache data if available (offline fallback)
			const cachedPokemon =
				typeof idOrName === 'number'
					? await indexedDB.getPokemon(idOrName)
					: await indexedDB.getPokemonByName(idOrName.toString());

			return cachedPokemon || null;
		}
	}

	/**
	 * Get Pokemon species data (for evolution chain)
	 */
	async getSpecies(idOrName: string | number): Promise<PokemonSpecies | null> {
		await this.init();

		try {
			// Check cache first (species data changes less frequently)
			const id = typeof idOrName === 'number' ? idOrName : 0; // We'll handle name lookups later
			if (typeof idOrName === 'number') {
				const cached = await indexedDB.getSpecies(id);
				if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
					return cached.data;
				}
			}

			const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);

			if (!response.ok) {
				return null;
			}

			const data: PokemonSpecies = await response.json();

			// Cache the result
			await indexedDB.saveSpecies({
				id: data.id,
				data,
				cachedAt: Date.now()
			});

			return data;
		} catch (error) {
			console.error(`Error fetching species ${idOrName}:`, error);
			return null;
		}
	}

	/**
	 * Search Pokemon by name (uses cached data first, then API)
	 */
	async searchPokemon(query: string): Promise<PokemonListItem[]> {
		await this.init();

		// Search in cache first
		const allCached = await indexedDB.getAllPokemon();
		const filtered = allCached
			.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
			.map((p) => ({
				id: p.id,
				name: p.name,
				sprite: p.sprite,
				types: p.types
			}))
			.sort((a, b) => a.id - b.id);

		return filtered;
	}

	/**
	 * Get a range of Pokemon (for pagination)
	 */
	async getPokemonRange(offset: number, limit: number): Promise<PokemonListItem[]> {
		await this.init();

		try {
			// Try to get from cache first
			const ids = Array.from({ length: limit }, (_, i) => offset + i + 1);
			const cached = await indexedDB.getPokemonBatch(ids);

			// If all are cached, return them
			const allCached = cached.every((p) => p !== undefined);
			if (allCached) {
				return cached.map((p) => ({
					id: p!.id,
					name: p!.name,
					sprite: p!.sprite,
					types: p!.types
				}));
			}

			// Otherwise, fetch the list from API
			const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
			if (!response.ok) return [];

			const data = await response.json();

			// Fetch each Pokemon's details (this will cache them)
			const pokemonPromises = data.results.map((result: { name: string }) =>
				this.getPokemon(result.name)
			);

			const pokemon = await Promise.all(pokemonPromises);

			return pokemon
				.filter((p): p is Pokemon => p !== null)
				.map((p) => ({
					id: p.id,
					name: p.name,
					sprite: p.sprite,
					types: p.types
				}));
		} catch (error) {
			console.error('Error fetching Pokemon range:', error);

			// Fallback to cache
			const allCached = await indexedDB.getAllPokemon();
			return allCached
				.slice(offset, offset + limit)
				.map((p) => ({
					id: p.id,
					name: p.name,
					sprite: p.sprite,
					types: p.types
				}))
				.sort((a, b) => a.id - b.id);
		}
	}

	/**
	 * Pre-cache essential Pokemon (Gen 1 for quick access)
	 */
	async preCacheEssentials(): Promise<void> {
		await this.init();

		try {
			// Cache first 151 Pokemon (Gen 1) in the background
			const gen1Ids = Array.from({ length: 151 }, (_, i) => i + 1);

			// Batch fetch to avoid overwhelming the API
			const batchSize = 20;
			for (let i = 0; i < gen1Ids.length; i += batchSize) {
				const batch = gen1Ids.slice(i, i + batchSize);
				const cached = await indexedDB.getPokemonBatch(batch);

				// Only fetch Pokemon that aren't already cached
				const toFetch = batch.filter((id, index) => !cached[index]);

				if (toFetch.length > 0) {
					await Promise.all(toFetch.map((id) => this.getPokemon(id)));
				}

				// Small delay to be respectful of API rate limits
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		} catch (error) {
			console.error('Error pre-caching essentials:', error);
		}
	}

	/**
	 * Get random Pokemon (for fun/discovery)
	 */
	async getRandomPokemon(): Promise<Pokemon | null> {
		const randomId = Math.floor(Math.random() * 1025) + 1; // Up to Gen 9
		return this.getPokemon(randomId);
	}

	/**
	 * Get all Pokemon names for autocomplete (cached in localStorage)
	 */
	async getAllPokemonNames(): Promise<Array<{ id: number; name: string }>> {
		await this.init();

		// Check localStorage cache first
		const cached = localStorage.getItem('pokemon-names-list');
		if (cached) {
			try {
				return JSON.parse(cached);
			} catch {
				// Invalid cache, will fetch fresh
			}
		}

		try {
			// Fetch all Pokemon (Gen 1-9, about 1025 Pokemon)
			const response = await fetch(`${BASE_URL}/pokemon?limit=1025&offset=0`);
			if (!response.ok) return [];

			const data = await response.json();

			// Extract ID from URL and create list
			const pokemonList = data.results.map((result: { name: string; url: string }) => {
				const id = parseInt(result.url.split('/').slice(-2, -1)[0]);
				return { id, name: result.name };
			});

			// Cache in localStorage
			localStorage.setItem('pokemon-names-list', JSON.stringify(pokemonList));

			return pokemonList;
		} catch (error) {
			console.error('Error fetching Pokemon names:', error);
			return [];
		}
	}
}

export const pokeapi = new PokeAPIService();
