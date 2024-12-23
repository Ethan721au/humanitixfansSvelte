<script lang="ts">
	import Hero from '$lib/Hero/Hero.svelte';
	import ProductsDisplay from '$lib/ProductsDisplay/ProductsDisplay.svelte';
	import { getContext } from 'svelte';

	const cart = getContext('cart');
</script>

<main>
	<Hero />
	<ProductsDisplay />
</main>
