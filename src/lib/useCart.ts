import type { Attributes, Cart, Product, ProductVariant } from './shopify/types';
export type CartContext = {
	cart: Cart;
	addItem: (variant: ProductVariant, product: Product, attributes: Attributes[]) => Promise<void>;
};

export const useCart = (initialCart: Cart | undefined) => {
	const cart = initialCart;

	// const addItem = async (variant: ProductVariant, product: Product, attributes: Attributes[]) => {
	// 	const existingItem = cart?.lines.find((item) => item.merchandise.id === variant.id);
	// 	console.log(existingItem);
	// };

	const addItem = (data) => {
		console.log(data);
	};

	return {
		cart,
		addItem
	};
};
