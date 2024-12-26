import { addOnsKeys } from '$lib/constants';
import { getCollectionProducts } from '$lib/shopify';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const items = Object.fromEntries(formData.entries());
		const products = await getCollectionProducts({
			collection: items.collection
		});
		const product = products.find((p) => p.handle === items.product);
		const variant =
			product?.variants.find((v) => v.title === items.variant) || product?.variants[0];
		const addOns = Object.entries(items)
			.filter(([key]) => addOnsKeys.includes(key))
			.map(([key, value]) => ({ key, value }));
		const addOnsIds = addOns.map(({ key }) => {
			const merchandiseId = products
				.find((p) => p.handle === 'add-ons')
				?.variants.find((v) => v.title === key)?.id as string;

			if (!merchandiseId) {
				throw new Error(`Merchandise ID not found for add-on: ${key}`);
			}
			return {
				merchandiseId,
				quantity: 1,
				attributes: []
			};
		});

		const variantId = {
			merchandiseId: variant?.id || '',
			quantity: 1,
			attributes: addOns
		};

		const lines = [variantId, ...addOnsIds];

		return {
			lines,
			products
		};
	}
} satisfies Actions;
