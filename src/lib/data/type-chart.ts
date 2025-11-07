/**
 * Pokemon Type Effectiveness Chart
 * Values represent the damage multiplier when attacking type hits defending type
 * 0 = No effect (immune)
 * 0.5 = Not very effective
 * 1 = Normal effectiveness (omitted for brevity)
 * 2 = Super effective
 */

export const TYPES = [
	'normal',
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'fighting',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'dark',
	'steel',
	'fairy'
] as const;

export type PokemonType = (typeof TYPES)[number];

/**
 * Type effectiveness chart
 * Key: Attacking type
 * Value: Object with defending types and their multipliers (only non-1.0 values)
 */
export const TYPE_CHART: Record<PokemonType, Record<string, number>> = {
	normal: {
		rock: 0.5,
		ghost: 0,
		steel: 0.5
	},
	fire: {
		fire: 0.5,
		water: 0.5,
		grass: 2,
		ice: 2,
		bug: 2,
		rock: 0.5,
		dragon: 0.5,
		steel: 2
	},
	water: {
		fire: 2,
		water: 0.5,
		grass: 0.5,
		ground: 2,
		rock: 2,
		dragon: 0.5
	},
	electric: {
		water: 2,
		electric: 0.5,
		grass: 0.5,
		ground: 0,
		flying: 2,
		dragon: 0.5
	},
	grass: {
		fire: 0.5,
		water: 2,
		grass: 0.5,
		poison: 0.5,
		ground: 2,
		flying: 0.5,
		bug: 0.5,
		rock: 2,
		dragon: 0.5,
		steel: 0.5
	},
	ice: {
		fire: 0.5,
		water: 0.5,
		grass: 2,
		ice: 0.5,
		ground: 2,
		flying: 2,
		dragon: 2,
		steel: 0.5
	},
	fighting: {
		normal: 2,
		ice: 2,
		poison: 0.5,
		flying: 0.5,
		psychic: 0.5,
		bug: 0.5,
		rock: 2,
		ghost: 0,
		dark: 2,
		steel: 2,
		fairy: 0.5
	},
	poison: {
		grass: 2,
		poison: 0.5,
		ground: 0.5,
		rock: 0.5,
		ghost: 0.5,
		steel: 0,
		fairy: 2
	},
	ground: {
		fire: 2,
		electric: 2,
		grass: 0.5,
		poison: 2,
		flying: 0,
		bug: 0.5,
		rock: 2,
		steel: 2
	},
	flying: {
		electric: 0.5,
		grass: 2,
		fighting: 2,
		bug: 2,
		rock: 0.5,
		steel: 0.5
	},
	psychic: {
		fighting: 2,
		poison: 2,
		psychic: 0.5,
		dark: 0,
		steel: 0.5
	},
	bug: {
		fire: 0.5,
		grass: 2,
		fighting: 0.5,
		poison: 0.5,
		flying: 0.5,
		psychic: 2,
		ghost: 0.5,
		dark: 2,
		steel: 0.5,
		fairy: 0.5
	},
	rock: {
		fire: 2,
		ice: 2,
		fighting: 0.5,
		ground: 0.5,
		flying: 2,
		bug: 2,
		steel: 0.5
	},
	ghost: {
		normal: 0,
		psychic: 2,
		ghost: 2,
		dark: 0.5
	},
	dragon: {
		dragon: 2,
		steel: 0.5,
		fairy: 0
	},
	dark: {
		fighting: 0.5,
		psychic: 2,
		ghost: 2,
		dark: 0.5,
		fairy: 0.5
	},
	steel: {
		fire: 0.5,
		water: 0.5,
		electric: 0.5,
		ice: 2,
		rock: 2,
		steel: 0.5,
		fairy: 2
	},
	fairy: {
		fire: 0.5,
		fighting: 2,
		poison: 0.5,
		dragon: 2,
		dark: 2,
		steel: 0.5
	}
};

/**
 * Calculate type effectiveness for an attacking type against one or more defending types
 * @param attackingType The type of the attacking move
 * @param defendingTypes Array of defending Pokemon's types (1 or 2 types)
 * @returns Damage multiplier (0, 0.25, 0.5, 1, 2, or 4)
 */
export function calculateEffectiveness(
	attackingType: PokemonType,
	defendingTypes: PokemonType[]
): number {
	return defendingTypes.reduce((multiplier, defType) => {
		const effectiveness = TYPE_CHART[attackingType]?.[defType] ?? 1;
		return multiplier * effectiveness;
	}, 1);
}

/**
 * Get all super effective types against a given defending type combination
 * @param defendingTypes Array of defending Pokemon's types
 * @returns Array of types that are super effective
 */
export function getSuperEffectiveTypes(defendingTypes: PokemonType[]): PokemonType[] {
	return TYPES.filter((attackingType) => {
		const effectiveness = calculateEffectiveness(attackingType, defendingTypes);
		return effectiveness > 1;
	});
}

/**
 * Get all not very effective types against a given defending type combination
 * @param defendingTypes Array of defending Pokemon's types
 * @returns Array of types that are not very effective
 */
export function getNotVeryEffectiveTypes(defendingTypes: PokemonType[]): PokemonType[] {
	return TYPES.filter((attackingType) => {
		const effectiveness = calculateEffectiveness(attackingType, defendingTypes);
		return effectiveness < 1 && effectiveness > 0;
	});
}

/**
 * Get all types that have no effect against a given defending type combination
 * @param defendingTypes Array of defending Pokemon's types
 * @returns Array of types that have no effect
 */
export function getNoEffectTypes(defendingTypes: PokemonType[]): PokemonType[] {
	return TYPES.filter((attackingType) => {
		const effectiveness = calculateEffectiveness(attackingType, defendingTypes);
		return effectiveness === 0;
	});
}

/**
 * Get effectiveness category as a string
 * @param multiplier The effectiveness multiplier
 * @returns String description of effectiveness
 */
export function getEffectivenessLabel(multiplier: number): string {
	if (multiplier === 0) return 'No Effect';
	if (multiplier === 0.25) return 'Double Resist';
	if (multiplier === 0.5) return 'Not Very Effective';
	if (multiplier === 1) return 'Normal';
	if (multiplier === 2) return 'Super Effective';
	if (multiplier === 4) return 'Double Weakness';
	return 'Normal';
}

/**
 * Get types that the attacking types are super effective against
 * @param attackingTypes Array of attacking Pokemon's types
 * @returns Array of types that take super effective damage
 */
export function getOffensiveSuperEffective(attackingTypes: PokemonType[]): PokemonType[] {
	const effectiveTypes = new Set<PokemonType>();

	for (const attackingType of attackingTypes) {
		for (const defendingType of TYPES) {
			const effectiveness = TYPE_CHART[attackingType]?.[defendingType] ?? 1;
			if (effectiveness > 1) {
				effectiveTypes.add(defendingType);
			}
		}
	}

	return Array.from(effectiveTypes);
}

/**
 * Get types that the attacking types are not very effective against
 * @param attackingTypes Array of attacking Pokemon's types
 * @returns Array of types that resist the attacks
 */
export function getOffensiveNotVeryEffective(attackingTypes: PokemonType[]): PokemonType[] {
	const resistantTypes = new Set<PokemonType>();

	for (const attackingType of attackingTypes) {
		for (const defendingType of TYPES) {
			const effectiveness = TYPE_CHART[attackingType]?.[defendingType] ?? 1;
			if (effectiveness < 1 && effectiveness > 0) {
				resistantTypes.add(defendingType);
			}
		}
	}

	return Array.from(resistantTypes);
}

/**
 * Get types that the attacking types have no effect against
 * @param attackingTypes Array of attacking Pokemon's types
 * @returns Array of types that are immune
 */
export function getOffensiveNoEffect(attackingTypes: PokemonType[]): PokemonType[] {
	const immuneTypes = new Set<PokemonType>();

	for (const attackingType of attackingTypes) {
		for (const defendingType of TYPES) {
			const effectiveness = TYPE_CHART[attackingType]?.[defendingType] ?? 1;
			if (effectiveness === 0) {
				immuneTypes.add(defendingType);
			}
		}
	}

	return Array.from(immuneTypes);
}
