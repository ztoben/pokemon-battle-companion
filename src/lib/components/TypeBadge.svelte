<script lang="ts">
	import type { PokemonType } from '$lib/data/type-chart';
	import {
		getTypeColor,
		getTypeDarkColor,
		getTypeTextColor,
		getTypeOutlineColor
	} from '$lib/data/type-colors';

	interface Props {
		type: PokemonType;
		selected?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		onclick?: () => void;
		multiplier?: number;
	}

	let {
		type,
		selected = false,
		disabled = false,
		size = 'md',
		onclick,
		multiplier
	}: Props = $props();

	const bgColor = getTypeColor(type);
	const borderColor = getTypeDarkColor(type);
	const textColor = getTypeTextColor(type);
	const outlineColor = getTypeOutlineColor(type);

	const sizeClasses = {
		sm: 'text-xs px-3 py-1.5',
		md: 'text-sm px-3 py-1.5',
		lg: 'text-base px-4 py-2'
	};
</script>

<button
	class="type-badge {sizeClasses[size]}"
	class:selected
	class:disabled
	style:--bg-color={bgColor}
	style:--border-color={borderColor}
	style:--text-color={textColor}
	style:--outline-color={outlineColor}
	{onclick}
	{disabled}
	aria-label={`${type} type`}
	aria-pressed={selected}
>
	<span class="type-name">{type.toUpperCase()}</span>
	{#if multiplier}
		<span class="multiplier">{multiplier}x</span>
	{/if}
</button>

<style>
	.type-badge {
		font-family: var(--font-heading);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background-color: var(--bg-color);
		color: var(--text-color);
		border: 3px solid var(--border-color);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: center;
		box-shadow: 3px 3px 0 var(--border-color);
		position: relative;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		box-sizing: border-box;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.type-badge:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--border-color);
	}

	.type-badge.selected {
		box-shadow:
			inset 0 0 0 3px var(--outline-color),
			3px 3px 0 var(--border-color);
	}

	.type-badge.selected:active {
		box-shadow:
			inset 0 0 0 3px var(--outline-color),
			1px 1px 0 var(--border-color);
	}

	.type-badge.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.type-badge.disabled:active {
		transform: none;
		box-shadow: 3px 3px 0 var(--border-color);
	}

	.type-badge:focus-visible {
		outline: 3px solid var(--outline-color);
		outline-offset: 2px;
	}

	.type-badge {
		gap: 6px;
	}

	.type-name {
		padding: 0 2px;
	}

	.multiplier {
		font-size: 0.625rem;
		background-color: var(--outline-color);
		color: white;
		padding: 2px 4px;
		border-radius: 3px;
		text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
		font-weight: bold;
	}
</style>
