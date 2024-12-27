<script lang="ts">
	import { setContext } from 'svelte';
	import type { Cart } from '../shopify/types';
	import { createCartStore } from './CartStore';

	export let initialCart: Cart;

	const cartStore = createCartStore(initialCart);
	console.log('cartStore', cartStore);

	setContext('cart', cartStore);
</script>

<slot />
