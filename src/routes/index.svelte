<script lang="ts">
	import GameBoard from '../components/GameBoard.svelte';
	import Header from '../components/Header.svelte';
	import { onMount } from 'svelte';
	import Explanation from '../components/Modals/Explanation.svelte';

	let showExplanation = false;

	onMount(() => {
		const shown = localStorage.getItem('explanation');
		if (!shown) {
			showExplanation = true;
			localStorage.setItem('explanation', JSON.stringify(true));
		}
	});
</script>

<main class="flex flex-col h-fit md:h-screen pb-4 max-w-md m-auto pb-4">
	{#if showExplanation}
		<Explanation on:click={() => (showExplanation = false)} />
	{/if}
	<div class="h-16  mb-4 md:mb-12  flex flex-initial">
		<Header />
	</div>
	<div class="flex-1 pl-4 pr-4">
		<GameBoard />
	</div>
</main>
