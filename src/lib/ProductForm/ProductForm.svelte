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
	export let collection: Collection;
	let collectionProducts: Product[] = [];
	let productLine: CartItem | undefined;
	let selectedProduct: string = 'default';
	let selectedVariant: string = 'default';
	let selectedAddOns: AddOn[] = [];
	let additionalInfo: FormDataEntryValue;

	$: if (collection?.handle) {
		fetchCollectionProducts();
	}

	$: products = collectionProducts?.filter((p) => p.productType === 'product');

	$: productsWithVariants = products?.filter((product) => product.variants.length > 1);

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
	}

	$: productVariants = productsWithVariants.find((p) => p.handle === selectedProduct);

	$: productAddOns = collectionProducts.filter((p) => p.productType === 'add-on')[0]?.variants;
</script>

<Wrapper>
	<form method="POST">
		<div style="display: flex; flex-direction:column">
			<input type="hidden" name="collection" value={collection?.handle} />
			<Input
				type="text"
				bold
				label={`${collection?.title} *`}
				options={products}
				{selectedProduct}
				name="product"
				onChange={(product) => {
					if (typeof product === 'string') {
						selectedProduct = product;
					}
				}}
			/>
			{#if productVariants}
				<Input
					type="text"
					bold
					label={`${productVariants.options[0].name} *`}
					options={productVariants.variants}
					selectedProduct={selectedVariant}
					name="variant"
					onChange={(variant) => {
						if (typeof variant === 'string') {
							selectedVariant = variant;
						}
					}}
				/>
			{/if}
		</div>
		<Input
			type="text"
			bold
			label="Additional Information"
			name="addInfo"
			value={additionalInfo}
			onChange={(addInfo) => {
				if (typeof addInfo === 'string') {
					additionalInfo = addInfo;
				}
			}}
		/>
		{#if productAddOns}
			{#each productAddOns as productAddOn (productAddOn.id)}
				<Input
					type="checkbox"
					label={productAddOn.title}
					name={productAddOn.title}
					checked={selectedAddOns?.find((a) => a.id === productAddOn.id)?.checked || false}
					onChange={(checked) => {
						if (typeof checked === 'boolean') {
							const existingAddOn = selectedAddOns.find((a) => a.id === productAddOn.id);
							if (existingAddOn) {
								selectedAddOns = selectedAddOns.map((a) =>
									a.id === productAddOn.id ? { ...a, checked } : a
								);
							} else {
								selectedAddOns = [
									...selectedAddOns,
									{
										id: productAddOn.id,
										title: productAddOn.title,
										checked
									}
								];
							}
						}
					}}
				/>
				{#if selectedAddOns.find((a) => a.id === productAddOn.id)?.checked}
					<Input
						type="text"
						bold
						label={`${productAddOn.title} *`}
						name={productAddOn.title}
						value={selectedAddOns.find((a) => a.id === productAddOn.id)?.value || ''}
						onChange={(value) => {
							if (typeof value === 'string') {
								selectedAddOns = selectedAddOns.map((a) =>
									a.id === productAddOn.id ? { ...a, value } : a
								);
							}
						}}
					/>
				{/if}
			{/each}
		{/if}
		<button>test</button>
	</form>
</Wrapper>
