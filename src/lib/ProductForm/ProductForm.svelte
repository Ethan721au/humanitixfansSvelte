<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import { getCollectionProducts } from '$lib/shopify';
	import type { Cart, CartItem, Collection, Product } from '$lib/shopify/types';
	import { Wrapper } from './styled';

	type AddOn = {
		id: string;
		title: string;
		checked: boolean;
		value?: FormDataEntryValue | undefined;
	};

	export let cart: Cart | undefined;
	export let collection: Collection | undefined;
	let collectionProducts: Product[] = [];
	let productLine: CartItem | undefined;
	let selectedProduct: string | undefined;
	let selectedVariant: string | undefined;
	let selectedAddOns: AddOn[] = [];

	$: if (collection) {
		fetchCollectionProducts();
	}

	$: if (cart) {
		productLine = cart.lines.find((line) => line.merchandise.product.handle !== 'add-ons');

		if (productLine) {
			selectedProduct = productLine.merchandise.product.handle;
			selectedVariant = productLine.merchandise.selectedOptions[0].value;

			const cartAddOns = cart.lines.filter((line) => line.merchandise.product.handle === 'add-ons');

			if (cartAddOns) {
				selectedAddOns = cartAddOns.map((addOn) => ({
					id: addOn.merchandise.id,
					title: addOn.merchandise.title,
					checked: true,
					value: productLine?.attributes.find((a) => a.key === addOn.merchandise.title)?.value
				}));
			}
		}
	}

	async function fetchCollectionProducts() {
		const fetchedProducts = await getCollectionProducts({
			collection: collection?.handle
		});
		collectionProducts = fetchedProducts;
		console.log(collectionProducts);
	}

	const products = collectionProducts?.filter((p) => p.productType === 'product');

	const productsWithVariants = products?.filter((product) => product.variants.length > 1);

	const productVariants = productsWithVariants?.find((p) => p.handle === selectedProduct);

	const productAddOns = collectionProducts?.filter((p) => p.productType === 'add-on')[0]?.variants;
</script>

<Wrapper>
	<div>{collection?.title}</div>
	<div>{selectedProduct}</div>
	<Input type="text" bold label={collection?.title} />
</Wrapper>
