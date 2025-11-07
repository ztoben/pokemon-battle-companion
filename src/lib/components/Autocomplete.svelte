<script lang="ts">
	interface Option {
		id: number;
		name: string;
	}

	interface Props {
		value: string;
		options: Option[];
		placeholder?: string;
		onselect: (option: Option) => void;
		oninput: (value: string) => void;
		loading?: boolean;
	}

	let {
		value = $bindable(),
		options,
		placeholder = 'Search...',
		onselect,
		oninput,
		loading = false
	}: Props = $props();

	let showDropdown = $state(false);
	let highlightedIndex = $state(0);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		oninput(value);
		showDropdown = true;
		highlightedIndex = 0;
	}

	function selectOption(option: Option) {
		value = option.name;
		showDropdown = false;
		onselect(option);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!showDropdown) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (options[highlightedIndex]) {
					selectOption(options[highlightedIndex]);
				}
				break;
			case 'Escape':
				showDropdown = false;
				break;
		}
	}

	function formatName(name: string): string {
		return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
	}

	function formatId(id: number): string {
		return `#${id.toString().padStart(4, '0')}`;
	}

	$effect(() => {
		if (options.length > 0 && value.length > 0) {
			showDropdown = true;
		}
	});
</script>

<div class="autocomplete">
	<div class="input-wrapper">
		<input
			type="text"
			{value}
			{placeholder}
			class="autocomplete-input"
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => (showDropdown = value.length > 0 && options.length > 0)}
			onblur={() => setTimeout(() => (showDropdown = false), 200)}
			autocomplete="off"
		/>
		{#if value}
			<button
				class="clear-btn"
				onclick={() => {
					value = '';
					oninput('');
					showDropdown = false;
				}}
				type="button"
			>
				×
			</button>
		{/if}
	</div>

	{#if showDropdown && options.length > 0}
		<ul class="autocomplete-dropdown">
			{#each options as option, index (option.id)}
				<li>
					<button
						type="button"
						class="autocomplete-option"
						class:highlighted={index === highlightedIndex}
						onclick={() => selectOption(option)}
					>
						<span class="option-id">{formatId(option.id)}</span>
						<span class="option-name">{formatName(option.name)}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if loading}
		<div class="autocomplete-loading">Loading...</div>
	{/if}
</div>

<style>
	.autocomplete {
		position: relative;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		width: 100%;
	}

	.autocomplete-input {
		width: 100%;
		padding: var(--space-md);
		padding-right: 3rem;
		font-family: var(--font-body);
		font-size: 1.125rem;
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		background-color: var(--color-surface);
		color: var(--color-text);
		box-shadow: 4px 4px 0 var(--color-text);
		transition: all var(--transition-fast);
	}

	.autocomplete-input:focus {
		outline: none;
		box-shadow: 4px 4px 0 var(--color-primary);
		border-color: var(--color-primary);
	}

	.clear-btn {
		position: absolute;
		right: var(--space-md);
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		font-size: 2rem;
		color: var(--color-text-light);
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--transition-fast);
		line-height: 1;
	}

	.clear-btn:hover {
		color: var(--color-text);
	}

	.autocomplete-dropdown {
		position: absolute;
		top: calc(100% + var(--space-xs));
		left: 0;
		right: 0;
		max-height: 300px;
		overflow-y: auto;
		background-color: var(--color-surface);
		border: 3px solid var(--color-text);
		border-radius: var(--radius-md);
		box-shadow: 4px 4px 0 var(--color-text);
		list-style: none;
		z-index: 1000;
	}

	.autocomplete-dropdown li {
		list-style: none;
	}

	.autocomplete-option {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		cursor: pointer;
		transition: background-color var(--transition-fast);
		border-bottom: 2px solid var(--color-border);
		background: none;
		border-left: none;
		border-right: none;
		border-top: none;
		width: 100%;
		text-align: left;
		font: inherit;
		color: inherit;
	}

	.autocomplete-option:last-child {
		border-bottom: none;
	}

	.autocomplete-option:hover,
	.autocomplete-option.highlighted {
		background-color: var(--color-background);
	}

	.option-id {
		font-family: var(--font-heading);
		font-size: 0.625rem;
		color: var(--color-text-light);
		min-width: 3rem;
	}

	.option-name {
		font-size: 1rem;
		flex: 1;
	}

	.autocomplete-loading {
		position: absolute;
		top: 50%;
		right: var(--space-md);
		transform: translateY(-50%);
		font-family: var(--font-heading);
		font-size: 0.625rem;
		color: var(--color-text-light);
		animation: pixel-fade 1s infinite;
	}
</style>
