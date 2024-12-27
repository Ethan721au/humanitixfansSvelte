<script lang="ts">
	import { createCartStore } from '$lib/Cart/CartStore.js';
	import ProductForm from '$lib/ProductForm/ProductForm.svelte';
	import { getCollections } from '$lib/shopify';
	import type { Cart, CartItem, Collection } from '$lib/shopify/types';
	import type { CartContext } from '$lib/useCart.svelte.js';
	import { getContext } from 'svelte';

	// const { cart, addCartItem } = getContext<CartContext>('cart');
	const { cart } = getContext<{ cart: Writable<Cart> }>('cart');
	const { dispatch } = createCartStore();
	let currentCart;
	$: currentCart = $cart;
	export let form;
	let collections: Collection[] = [];
	let collection: Collection;
	let productLine: CartItem | undefined;

	$: if (form) {
		form.lines.forEach((line) => {
			const product = form?.products.find((p) =>
				p.variants.some((v) => v.id === line.merchandiseId)
			);
			const variant = product?.variants.find((v) => v.id === line.merchandiseId);
			const attributes = line.attributes.map((attr) => ({
				key: attr.key,
				value: attr.value
			}));

			if (variant && product) {
				// addCartItem(variant, product, attributes);
				dispatch({
					type: 'ADD_ITEM',
					payload: {
						variant,
						product,
						attributes
					}
				});
			} else {
				console.error('Skipping item due to missing product or variant:', line);
			}
		});
	}

	$: if (currentCart) {
		productLine = currentCart.lines.find((line) => line.merchandise.product.handle !== 'add-ons');
	}

	// $: addItem(form);

	// $effect(() => {
	// 	if (form) {
	// 		addItem(form);
	// 	}
	// });

	// const collection = $derived(() => collections.find((c) => c.handle === 'send-in-item'));

	// const productLine = $derived(() =>
	// 	cart ? cart.lines.find((line) => line.merchandise.product.handle !== 'add-ons') : undefined
	// );

	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	onMount(async () => {
		collections = await getCollections();
		// collection = collections.find(
		// 	(c) => c.handle === productLine?.merchandise?.product?.collections?.edges[0].node.handle
		// );
		collection = collections.find((c) => c.handle === 'send-in-item');
	});
</script>

<div
	style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 0 20px;"
>
	<div>sdfsdf</div>
	<ProductForm {cart} {collection} />
</div>
