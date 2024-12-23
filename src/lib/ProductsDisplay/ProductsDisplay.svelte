<script lang="ts">
	import { getCollections } from '$lib/shopify';
	import { onMount } from 'svelte';
	import { CardWrapper, Subtitle, Title, Wrapper } from './styled';
	import type { Collection } from '$lib/shopify/types';
	import CollectionCard from '$lib/CollectionCard/CollectionCard.svelte';

	let collections: Collection[] = [];

	onMount(async () => {
		collections = await getCollections();
	});
</script>

<Wrapper>
	<Title>Lorem ipsum dolor</Title>
	<Subtitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Subtitle>
	<CardWrapper>
		{#each collections as collection (collection.title)}
			{#if collection.handle !== ''}
				<CollectionCard {collection} />
			{/if}
		{/each}
	</CardWrapper>
</Wrapper>
