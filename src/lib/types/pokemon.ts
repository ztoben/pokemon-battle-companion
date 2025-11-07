import type { PokemonType } from '$lib/data/type-chart';

/**
 * Simplified Pokemon data structure from PokeAPI
 */
export interface Pokemon {
	id: number;
	name: string;
	types: PokemonType[];
	sprite: string;
	height: number;
	weight: number;
	stats: PokemonStats;
	species_url: string;
}

export interface PokemonStats {
	hp: number;
	attack: number;
	defense: number;
	specialAttack: number;
	specialDefense: number;
	speed: number;
}

/**
 * Raw PokeAPI Pokemon response
 */
export interface PokeAPIResponse {
	id: number;
	name: string;
	height: number;
	weight: number;
	sprites: {
		front_default: string;
		other?: {
			'official-artwork'?: {
				front_default: string;
			};
		};
	};
	types: Array<{
		slot: number;
		type: {
			name: string;
			url: string;
		};
	}>;
	stats: Array<{
		base_stat: number;
		stat: {
			name: string;
		};
	}>;
	species: {
		url: string;
	};
}

/**
 * Evolution chain data
 */
export interface EvolutionChain {
	species: string;
	evolvesTo: EvolutionChain[];
	evolutionDetails: EvolutionDetail | null;
}

export interface EvolutionDetail {
	minLevel?: number;
	trigger: string;
	item?: string;
	condition?: string;
}

/**
 * Pokemon species data from PokeAPI
 */
export interface PokemonSpecies {
	id: number;
	name: string;
	evolution_chain: {
		url: string;
	};
	genera: Array<{
		genus: string;
		language: {
			name: string;
		};
	}>;
	flavor_text_entries: Array<{
		flavor_text: string;
		language: {
			name: string;
		};
		version: {
			name: string;
		};
	}>;
}

/**
 * Search result for Pokemon list
 */
export interface PokemonListItem {
	id: number;
	name: string;
	sprite: string;
	types: PokemonType[];
}

/**
 * Cached data structure in IndexedDB
 */
export interface CachedPokemon extends Pokemon {
	cachedAt: number;
}

export interface CachedSpecies {
	id: number;
	data: PokemonSpecies;
	cachedAt: number;
}
