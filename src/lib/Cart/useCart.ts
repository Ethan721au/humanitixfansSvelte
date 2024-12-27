import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Cart } from '../shopify/types';

export function useCart() {
	const cartStore = getContext<Writable<Cart>>('cart');

	if (!cartStore) {
		throw new Error('useCart must be used within a CartProvider');
	}

	return cartStore;
}
