<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import Header from '$lib/Header/Header.svelte';
	import '../styles/global.css';
	import type { PageData } from './$types';
	import CartContext from '$lib/Cart/CartContext.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let cartStore = data.cart;
</script>

<CartContext initialCart={cartStore}>
	<Header />
	<div style="padding-top: 72px;">{@render children()}</div>
</CartContext>
