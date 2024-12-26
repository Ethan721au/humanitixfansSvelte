<script lang="ts">
	import type { Product, ProductVariant } from '$lib/shopify/types';
	import { Label, Wrapper } from './styled';

	export let type: string;
	export let name: string;
	export let label: string | undefined;
	export let bold: boolean;
	export let product: Product;
	export let options: Product[] | ProductVariant[];
	export let selectedProduct: string;
	export let onChange: (e: boolean | string) => void;
	export let checked: boolean;
	export let value: FormDataEntryValue | undefined | string;
</script>

<Wrapper {type}>
	{#if name !== 'product' && name !== 'variant'}
		<input
			{type}
			{name}
			{checked}
			id={product?.id}
			value={typeof value === 'string' ? value : ''}
			on:input={(e) => onChange(e.target.value || e.target.checked)}
		/>
	{/if}
	<Label bold={bold ? 'true' : 'false'} htmlFor={name}>
		{label}
	</Label>
	{#if name === 'product' || name === 'variant'}
		<select id={name} {name} value={selectedProduct} on:change={(e) => onChange(e.target.value)}>
			<option value="default" disabled>
				--Select a {name}--
			</option>
			{#each options as option (option.id)}
				<option value={name === 'product' ? option.handle : option.title}>
					{name === 'product' ? option.description : option.title}
				</option>
			{/each}
		</select>
	{/if}
</Wrapper>

<style>
	input {
		appearance: none;
		outline: none;
		background-color: none;
		border-radius: 4px;
		border: 1px solid #e5e5e5;
	}

	input[type='checkbox'] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	input[type='checkbox']:checked {
		background-color: var(--primary-peach);
		border: none;
	}

	input[type='checkbox']:focus {
		transition: none;
		outline: none;
	}

	input:not([type='checkbox']) {
		/* width: 100%;
		height: 100%; */
		cursor: text;
	}

	input:not([type='checkbox']):focus {
		transition: outline-offset 0.2s ease-out;
		outline: var(--focused-base-outline);
		outline-offset: var(--focused-base-outline-offset);
	}

	select {
		width: 100%;
		outline: none;
		border-radius: 4px;
		border: 1px solid #e5e5e5;
	}
</style>
