<script lang="ts">
	import GameBoard from '../components/GameBoard.svelte';
	import Header from '../components/Header.svelte';
	import { onMount } from 'svelte';
	import Explanation from '../components/Modals/Explanation.svelte';
	import differenceInDays from 'date-fns/differenceInDays/index.js';

	let showExplanation = false;
	const firstDate = new Date(2022, 0, 31);
	const today = new Date();
	const wordIdx = differenceInDays(today, firstDate);

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
		<Header {wordIdx} />
	</div>
	<div class="flex-1 pl-4 pr-4">
		<GameBoard {wordIdx} />
	</div>
</main>
