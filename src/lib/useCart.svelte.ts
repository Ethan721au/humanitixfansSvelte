import { writable, type Writable } from 'svelte/store';
import type { Attributes, Cart, CartItem, Product, ProductVariant } from './shopify/types';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
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

export type CartContext = {
	cart: Cart;
	addCartItem: (
		variant: ProductVariant,
		product: Product,
		attributes: Attributes[]
	) => Promise<void>;
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

export const useCart = (initialCart: Cart | undefined) => {
	// let cart = $state(createEmptyCart());
	const cart: Writable<Cart> = writable(initialCart || createEmptyCart());

	const cartReducer = (state: Cart, action: CartAction): Cart => {
		const currentCart = state || createEmptyCart();

		switch (action.type) {
			case 'ADD_ITEM': {
				const { variant, product, attributes } = action.payload;
				const existingItem = currentCart.lines.find((item) => item.merchandise.id === variant.id);
				const updatedItem = createOrUpdateCartItem(existingItem, variant, product, attributes);

				const updatedLines = existingItem
					? currentCart.lines.map((item) =>
							item.merchandise.id === variant.id ? updatedItem : item
						)
					: [...currentCart.lines, updatedItem];

				const updatedCart = {
					...currentCart,
					...updateCartTotals(updatedLines),
					lines: updatedLines
				};

				return updatedCart;
			}
			default:
				return currentCart;
		}
	};

	// const addCartItem = (variant: ProductVariant, product: Product, attributes: Attributes[]) => {
	// 	const newCart = cartReducer(cart, {
	// 		type: 'ADD_ITEM',
	// 		payload: { variant, product, attributes }
	// 	});
	// 	console.log('newCart', newCart);
	// 	cart = newCart;
	// 	console.log('cart', cart);
	// };

	const addCartItem = (variant: ProductVariant, product: Product, attributes: Attributes[]) => {
		cart.update((currentCart) => {
			return cartReducer(currentCart, {
				type: 'ADD_ITEM',
				payload: { variant, product, attributes }
			});
		});
	};

	return {
		cart,
		addCartItem
	};
};
