import type { PokemonType } from './type-chart';

/**
 * Official Pokemon type colors
 * These match the standard Pokemon type badge colors used in games and media
 */
export const TYPE_COLORS: Record<PokemonType, string> = {
	normal: '#A8A878',
	fire: '#F08030',
	water: '#6890F0',
	electric: '#F8D030',
	grass: '#78C850',
	ice: '#98D8D8',
	fighting: '#C03028',
	poison: '#A040A0',
	ground: '#E0C068',
	flying: '#A890F0',
	psychic: '#F85888',
	bug: '#A8B820',
	rock: '#B8A038',
	ghost: '#705898',
	dragon: '#7038F8',
	dark: '#705848',
	steel: '#B8B8D0',
	fairy: '#EE99AC'
};

/**
 * Get the color for a Pokemon type
 * @param type The Pokemon type
 * @returns Hex color code
 */
export function getTypeColor(type: PokemonType): string {
	return TYPE_COLORS[type];
}

/**
 * Get a darker shade of a type color (for borders/shadows)
 * @param type The Pokemon type
 * @returns Hex color code (darkened)
 */
export function getTypeDarkColor(type: PokemonType): string {
	const color = TYPE_COLORS[type];
	// Simple darkening by reducing each RGB component
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	const darken = (val: number) => Math.max(0, Math.floor(val * 0.7));

	return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
}

/**
 * Determine if white or black text should be used on a type background
 * @param type The Pokemon type
 * @returns 'white' or 'black'
 */
export function getTypeTextColor(type: PokemonType): 'white' | 'black' {
	const color = TYPE_COLORS[type];
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	// Calculate relative luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Type icons/emoji (fallback for when sprites aren't loaded)
 */
export const TYPE_ICONS: Record<PokemonType, string> = {
	normal: '⭕',
	fire: '🔥',
	water: '💧',
	electric: '⚡',
	grass: '🌿',
	ice: '❄️',
	fighting: '👊',
	poison: '☠️',
	ground: '⛰️',
	flying: '🦅',
	psychic: '🔮',
	bug: '🐛',
	rock: '🪨',
	ghost: '👻',
	dragon: '🐉',
	dark: '🌙',
	steel: '⚙️',
	fairy: '✨'
};

/**
 * Get a darker version of a type color for outline/selection
 * @param type The Pokemon type
 * @returns Hex color code (darkened)
 */
export function getTypeOutlineColor(type: PokemonType): string {
	const color = TYPE_COLORS[type];
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	// Darken by about 40%
	const darken = (val: number) => Math.max(0, Math.floor(val * 0.6));

	return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
}
