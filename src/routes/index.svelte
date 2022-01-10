<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';
	import { LetterIndicator, WordBoard } from '../components/WordBoard';

	let tilesArr;
	let rowsArr;
	let rowsCount = 6;
	let inputsDisabled = false;
	let indicators: LetterIndicator[][] = [];

	const solution = 'pharm';
	let game = new WordBoard({
		tiles: solution.length,
		rows: rowsCount,
		solution
	});
	let boardState = game.getBoardState();

	game.registerEvents({
		onInvalidWord: () => {
			console.log('triggered invalid word');
		},
		onValidWord: (result) => {
			indicators.push(result);
			console.log('indicators: ', result);
			console.log('WORD WAS VALID! Submitted now');
		},
		onGameCompleted: () => {
			console.log('GAME IS COMPLETE.. MUAAH');
		}
	});

	tilesArr = Array.from({ length: solution.length }, (x, i) => i);
	rowsArr = Array.from({ length: rowsCount }, (x, i) => i);

	function handleTap(e) {
		if (inputsDisabled) {
			return;
		}
		boardState = game.addLetter(e.detail);
	}
</script>

<h1>Ordbord</h1>
<main>
	<div id="board" class="font-bold h-96 m-auto w-80 grid grid-rows-6 gap-0.5">
		{#each rowsArr as row}
			<Row
				tiles={tilesArr}
				{row}
				entered={boardState.boardState}
				submissions={boardState.submitted}
				{indicators}
			/>
		{/each}
	</div>
	<Keyboard on:tap={handleTap} />
</main>

<style>
</style>
