import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const items = Object.fromEntries(data.entries());
		return items;
	}
} satisfies Actions;
