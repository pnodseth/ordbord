<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';
	import { WordBoard } from '../WordBoard/WordBoard';
	import type { LetterIndicator } from '../WordBoard/interface';

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
		onGameCompleted: (result) => {
			console.log('GAME IS COMPLETE.. with result: ', result);
		}
	});

	tilesArr = Array.from({ length: solution.length }, (x, i) => i);
	rowsArr = Array.from({ length: rowsCount }, (x, i) => i);

	function handleInput(key) {
		let result = game.addLetter(key);
		if (result) {
			boardState = result;
		}
	}
	function handleTap(e) {
		if (inputsDisabled) {
			return;
		}
		let result = game.addLetter(e.detail);
		if (result) {
			boardState = result;
		}
	}

	function handleKeyboardInput(e) {
		handleInput(e.key);
	}
</script>

<svelte:body on:keyup={handleKeyboardInput} />
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
