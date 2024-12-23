<script lang="ts">
	import type { Collection, Product } from '$lib/shopify/types';
	import { getCollectionProducts } from '$lib/shopify';
	import {
		Description,
		PriceAmount,
		PriceText,
		PriceWrapper,
		TextWrapper,
		Title,
		Wrapper
	} from './styled';
	import Button from '$lib/Button/Button.svelte';

	export let collection: Collection;
	let products: Product[] = [];

	$: {
		// Whenever `collection` changes, fetch the products again
		if (collection) {
			getCollectionProducts({
				collection: collection.handle
			}).then((fetchedProducts) => {
				products = fetchedProducts;
			});
		}
	}

	const findLowestPriceVariant = () => {
		console.log(products);
		// Check if products is empty or not correctly populated
		if (!products || products.length === 0) {
			console.error('No products available');
			return null; // or return a fallback value
		}

		// Get valid price ranges
		const priceRanges = products
			.map((product) => product.priceRange)
			.filter((priceRange) => priceRange?.minVariantPrice?.amount);

		// Check if priceRanges is empty
		if (priceRanges.length === 0) {
			console.error('No valid price ranges available');
			return null; // or return a fallback value
		}

		// Find the lowest price variant using reduce
		const lowestPriceVariant = priceRanges.reduce((lowest, current) => {
			const currentAmount = parseFloat(current.minVariantPrice.amount || '0');
			const lowestAmount = parseFloat(lowest.minVariantPrice.amount || '0');
			return currentAmount < lowestAmount ? current : lowest;
		});

		// Return the lowest price amount
		return lowestPriceVariant.minVariantPrice.amount;
	};
</script>

<Wrapper>
	<TextWrapper>
		<Title>{collection.title}</Title>
		<Description>{collection.description}</Description>
	</TextWrapper>
	<PriceWrapper>
		<PriceText>from</PriceText>
		<PriceAmount>{`$${Math.round(Number(findLowestPriceVariant()))}`}</PriceAmount>
	</PriceWrapper>
	<Button link={`/${collection.handle}`} />
</Wrapper>
