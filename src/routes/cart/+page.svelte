<script lang="ts">
	import ProductForm from '$lib/ProductForm/ProductForm.svelte';
	import { getCollections } from '$lib/shopify';
	import type { Cart, CartItem, Collection } from '$lib/shopify/types';
	import { getContext } from 'svelte';

	const cart: Cart = getContext('cart');

	let collections: Collection[] = [];
	let collection: Collection;
	let productLine: CartItem | undefined;

	$: if (cart) {
		productLine = cart.lines.find((line) => line.merchandise.product.handle !== 'add-ons');
	}

	import { onMount } from 'svelte';

	onMount(async () => {
		collections = await getCollections();
		collection = collections.find(
			(c) => c.handle === productLine?.merchandise?.product?.collections?.edges[0].node.handle
		);
	});
</script>

<div
	style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 20px;"
>
	<div>sdfsdf</div>
	<ProductForm {cart} {collection} />
</div>
