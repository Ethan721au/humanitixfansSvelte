<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import Header from '$lib/Header/Header.svelte';
	import '../styles/global.css';

	let { children, data }: { children: Snippet } = $props();

	setContext('cart', data.cart);
</script>

<Header />
<div style="padding-top: 72px;">{@render children()}</div>
