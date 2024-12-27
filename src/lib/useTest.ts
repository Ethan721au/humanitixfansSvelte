import { writable } from 'svelte/store';
import type { Attributes, Cart, Product, ProductVariant } from './shopify/types';

export type CartContext = {
	cart: Cart;
	addCartItem: (
		variant: ProductVariant,
		product: Product,
		attributes: Attributes[]
	) => Promise<void>;
	removeCartItem: (variantId: string) => void;
	clearCart: () => void;
};

export const useTest = (initialCart: Cart | undefined) => {
	// Create a writable store to hold the cart state
	const cartStore = writable<Cart>(initialCart || { lines: [] });

	// Reducer function to handle cart state updates
	const cartReducer = (cart: Cart, action: { type: string; payload?: any }): Cart => {
		switch (action.type) {
			case 'ADD_ITEM': {
				const { variant, product, attributes } = action.payload;
				const existingLine = cart.lines.find((line) => line.merchandise.id === variant.id);

				if (existingLine) {
					// Increment quantity if the item exists
					existingLine.quantity += 1;
				} else {
					// Add a new item to the cart
					cart.lines.push({
						merchandise: variant,
						attributes,
						quantity: 1
					});
				}
				return { ...cart };
			}
			case 'REMOVE_ITEM': {
				return {
					...cart,
					lines: cart.lines.filter((line) => line.merchandise.id !== action.payload.id)
				};
			}
			case 'CLEAR_CART': {
				return { lines: [] };
			}
			default:
				return cart; // Return the current state for unknown actions
		}
	};

	// Dispatch function to apply reducer logic
	const dispatch = (action: { type: string; payload?: any }) => {
		cartStore.update((currentCart) => cartReducer(currentCart, action));
	};

	// Add an item to the cart
	const addCartItem = async (
		variant: ProductVariant,
		product: Product,
		attributes: Attributes[]
	) => {
		dispatch({ type: 'ADD_ITEM', payload: { variant, product, attributes } });
	};

	// const removeCartItem = (variantId: string) => {
	// 	dispatch({ type: 'REMOVE_ITEM', payload: { id: variantId } });
	// };

	// const clearCart = () => {
	// 	dispatch({ type: 'CLEAR_CART' });
	// };

	return {
		cart: cartStore,
		addCartItem
	};
};
