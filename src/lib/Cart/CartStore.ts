import { writable } from 'svelte/store';
import type { Cart, CartItem, Product, ProductVariant, Attributes } from '../shopify/types';

export type UpdateType = 'plus' | 'minus' | 'delete';

export type CartAction =
	| {
			type: 'UPDATE_ITEM';
			payload: { merchandiseId: string; updateType: UpdateType };
	  }
	| {
			type: 'ADD_ITEM';
			payload: {
				variant: ProductVariant;
				product: Product;
				attributes: Attributes[];
			};
	  };

function createEmptyCart(): Cart {
	return {
		id: undefined,
		checkoutUrl: '',
		totalQuantity: 4,
		lines: [],
		attributes: [],
		cost: {
			subtotalAmount: { amount: '0', currencyCode: 'USD' },
			totalAmount: { amount: '0', currencyCode: 'USD' },
			totalTaxAmount: { amount: '0', currencyCode: 'USD' }
		}
	};
}

function calculateItemCost(quantity: number, price: string): string {
	return (Number(price) * quantity).toString();
}

function updateCartTotals(lines: CartItem[]): Pick<Cart, 'totalQuantity' | 'cost'> {
	const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
	const totalAmount = lines.reduce((sum, item) => sum + Number(item.cost.totalAmount.amount), 0);
	const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

	return {
		totalQuantity,
		cost: {
			subtotalAmount: { amount: totalAmount.toString(), currencyCode },
			totalAmount: { amount: totalAmount.toString(), currencyCode },
			totalTaxAmount: { amount: '0', currencyCode }
		}
	};
}

function createOrUpdateCartItem(
	existingItem: CartItem | undefined,
	variant: ProductVariant,
	product: Product,
	attributes: Attributes[]
): CartItem {
	const quantity = existingItem ? existingItem.quantity + 1 : 1;
	const totalAmount = calculateItemCost(quantity, variant.price.amount);

	return {
		id: existingItem?.id,
		quantity,
		attributes: product.productType === 'add-on' ? attributes : [],
		cost: {
			totalAmount: {
				amount: totalAmount,
				currencyCode: variant.price.currencyCode
			}
		},
		merchandise: {
			id: variant.id,
			title: variant.title,
			selectedOptions: variant.selectedOptions,
			product: {
				id: product.id,
				handle: product.handle,
				title: product.title,
				featuredImage: product.featuredImage
			}
		}
	};
}

function cartReducer(state: Cart, action: CartAction): Cart {
	const currentCart = state || createEmptyCart();

	switch (action.type) {
		case 'ADD_ITEM': {
			const { variant, product, attributes } = action.payload;
			const existingItem = currentCart.lines.find((item) => item.merchandise.id === variant.id);
			const updatedItem = createOrUpdateCartItem(existingItem, variant, product, attributes);

			const updatedLines = existingItem
				? currentCart.lines.map((item) => (item.merchandise.id === variant.id ? updatedItem : item))
				: [...currentCart.lines, updatedItem];

			const updatedCart = {
				...currentCart,
				...updateCartTotals(updatedLines),
				lines: updatedLines
			};
			console.log('updatedCart', updatedCart);
			return updatedCart;
		}
		default:
			return currentCart;
	}
}

export function createCartStore(initialCart: Cart = createEmptyCart()) {
	const { subscribe, update } = writable(initialCart);

	return {
		subscribe,
		dispatch: (action: CartAction) => {
			update((state) => cartReducer(state, action));
		}
	};
}
