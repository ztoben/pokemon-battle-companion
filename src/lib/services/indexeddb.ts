import { openDB, type IDBPDatabase } from 'idb';
import type { CachedPokemon, CachedSpecies } from '$lib/types/pokemon';

const DB_NAME = 'pokemon-companion';
const DB_VERSION = 1;

/**
 * IndexedDB service for offline data storage
 */
class IndexedDBService {
	private db: IDBPDatabase | null = null;
	private initPromise: Promise<void> | null = null;

	/**
	 * Initialize the database
	 */
	async init(): Promise<void> {
		if (this.db) return;
		if (this.initPromise) return this.initPromise;

		this.initPromise = (async () => {
			try {
				this.db = await openDB(DB_NAME, DB_VERSION, {
					upgrade(db) {
						// Pokemon store
						if (!db.objectStoreNames.contains('pokemon')) {
							const pokemonStore = db.createObjectStore('pokemon', { keyPath: 'id' });
							pokemonStore.createIndex('name', 'name', { unique: false });
							pokemonStore.createIndex('cachedAt', 'cachedAt', { unique: false });
						}

						// Species store (for evolution data)
						if (!db.objectStoreNames.contains('species')) {
							const speciesStore = db.createObjectStore('species', { keyPath: 'id' });
							speciesStore.createIndex('cachedAt', 'cachedAt', { unique: false });
						}

						// Type effectiveness cache (for quick lookups)
						if (!db.objectStoreNames.contains('type-cache')) {
							db.createObjectStore('type-cache', { keyPath: 'key' });
						}

						// User favorites
						if (!db.objectStoreNames.contains('favorites')) {
							db.createObjectStore('favorites', { keyPath: 'id' });
						}
					}
				});
			} catch (error) {
				console.error('Failed to initialize IndexedDB:', error);
				throw error;
			}
		})();

		return this.initPromise;
	}

	/**
	 * Get a Pokemon from cache
	 */
	async getPokemon(id: number): Promise<CachedPokemon | undefined> {
		await this.init();
		if (!this.db) return undefined;
		return this.db.get('pokemon', id);
	}

	/**
	 * Get a Pokemon by name from cache
	 */
	async getPokemonByName(name: string): Promise<CachedPokemon | undefined> {
		await this.init();
		if (!this.db) return undefined;

		const tx = this.db.transaction('pokemon', 'readonly');
		const index = tx.store.index('name');
		return index.get(name.toLowerCase());
	}

	/**
	 * Save a Pokemon to cache
	 */
	async savePokemon(pokemon: CachedPokemon): Promise<void> {
		await this.init();
		if (!this.db) return;
		await this.db.put('pokemon', pokemon);
	}

	/**
	 * Get all cached Pokemon (for search/list views)
	 */
	async getAllPokemon(): Promise<CachedPokemon[]> {
		await this.init();
		if (!this.db) return [];
		return this.db.getAll('pokemon');
	}

	/**
	 * Get multiple Pokemon by IDs
	 */
	async getPokemonBatch(ids: number[]): Promise<(CachedPokemon | undefined)[]> {
		await this.init();
		if (!this.db) return [];

		const tx = this.db.transaction('pokemon', 'readonly');
		return Promise.all(ids.map((id) => tx.store.get(id)));
	}

	/**
	 * Get species data from cache
	 */
	async getSpecies(id: number): Promise<CachedSpecies | undefined> {
		await this.init();
		if (!this.db) return undefined;
		return this.db.get('species', id);
	}

	/**
	 * Save species data to cache
	 */
	async saveSpecies(species: CachedSpecies): Promise<void> {
		await this.init();
		if (!this.db) return;
		await this.db.put('species', species);
	}

	/**
	 * Add Pokemon to favorites
	 */
	async addFavorite(pokemon: CachedPokemon): Promise<void> {
		await this.init();
		if (!this.db) return;
		await this.db.put('favorites', pokemon);
	}

	/**
	 * Remove Pokemon from favorites
	 */
	async removeFavorite(id: number): Promise<void> {
		await this.init();
		if (!this.db) return;
		await this.db.delete('favorites', id);
	}

	/**
	 * Get all favorite Pokemon
	 */
	async getFavorites(): Promise<CachedPokemon[]> {
		await this.init();
		if (!this.db) return [];
		return this.db.getAll('favorites');
	}

	/**
	 * Check if a Pokemon is favorited
	 */
	async isFavorite(id: number): Promise<boolean> {
		await this.init();
		if (!this.db) return false;
		const result = await this.db.get('favorites', id);
		return result !== undefined;
	}

	/**
	 * Clear old cache entries (older than 30 days)
	 */
	async clearOldCache(): Promise<void> {
		await this.init();
		if (!this.db) return;

		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

		const pokemonTx = this.db.transaction('pokemon', 'readwrite');
		const pokemonIndex = pokemonTx.store.index('cachedAt');
		let pokemonCursor = await pokemonIndex.openCursor();

		while (pokemonCursor) {
			if (pokemonCursor.value.cachedAt < thirtyDaysAgo) {
				await pokemonCursor.delete();
			}
			pokemonCursor = await pokemonCursor.continue();
		}

		const speciesTx = this.db.transaction('species', 'readwrite');
		const speciesIndex = speciesTx.store.index('cachedAt');
		let speciesCursor = await speciesIndex.openCursor();

		while (speciesCursor) {
			if (speciesCursor.value.cachedAt < thirtyDaysAgo) {
				await speciesCursor.delete();
			}
			speciesCursor = await speciesCursor.continue();
		}
	}

	/**
	 * Get cache statistics
	 */
	async getCacheStats(): Promise<{ pokemonCount: number; speciesCount: number }> {
		await this.init();
		if (!this.db) return { pokemonCount: 0, speciesCount: 0 };

		const pokemonCount = await this.db.count('pokemon');
		const speciesCount = await this.db.count('species');

		return { pokemonCount, speciesCount };
	}

	/**
	 * Clear all data (useful for debugging or reset)
	 */
	async clearAll(): Promise<void> {
		await this.init();
		if (!this.db) return;

		await this.db.clear('pokemon');
		await this.db.clear('species');
		await this.db.clear('type-cache');
		// Don't clear favorites
	}
}

export const indexedDB = new IndexedDBService();
