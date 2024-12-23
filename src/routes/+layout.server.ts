import { getCart } from '$lib/shopify';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const cartId = cookies.get('cartId');
	const cart = await getCart(cartId);
	return { cart };
};
