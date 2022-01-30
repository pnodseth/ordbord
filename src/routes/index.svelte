<script lang="ts">
	import GameBoard from '../components/GameBoard.svelte';
	import Header from '../components/Header.svelte';
	import WrongWord from '../components/Modals/WrongWord.svelte';
	import { onMount } from 'svelte';
	import Won from '../components/Modals/Won.svelte';
	import Explanation from '../components/Modals/Explanation.svelte';

	let getHint: () => void;
	let showExplanation = false;

	let startNewGame: (wordLength: number, rows: number, solution?: string) => void;
	type UiState = 'idle' | 'fail' | 'won';
	let uiState: UiState = 'idle';
	let solution = '';

	function handleStartNew() {
		uiState = 'idle';
		startNewGame(5, 6);
	}

	onMount(() => {
		startNewGame(5, 6);
		const shown = localStorage.getItem('explanation');
		if (!shown) {
			showExplanation = true;
			localStorage.setItem('explanation', JSON.stringify(true));
		}
	});

	function handleResult(e) {
		const { status, word } = e.detail;

		solution = word;
		uiState = status;
	}
</script>

<main class="flex flex-col h-fit md:h-screen pb-4 max-w-md m-auto pb-4">
	{#if showExplanation}
		<Explanation on:click={() => (showExplanation = false)} />
	{/if}
	<div class="h-16  mb-4 md:mb-12  flex flex-initial">
		<Header>
			<button on:click={getHint}>Click</button>
		</Header>
	</div>
	<div class="flex-1 pl-4 pr-4">
		<GameBoard bind:getHint bind:startNewGame on:result={handleResult} />
	</div>
	{#if uiState === 'fail'}
		<WrongWord on:click={handleStartNew}>
			<p>Riktig ord: {solution.toUpperCase()}</p>
		</WrongWord>
	{/if}
	{#if uiState === 'won'}
		<Won on:click={handleStartNew}><p>Gratulerer!</p></Won>
	{/if}
</main>
