<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import Header from '$lib/Header/Header.svelte';
	import '../styles/global.css';
	import type { PageData } from './$types';
	import { useCart } from '$lib/useCart';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	setContext('cart', useCart(data.cart));
</script>

<Header />
<div style="padding-top: 72px;">{@render children()}</div>
