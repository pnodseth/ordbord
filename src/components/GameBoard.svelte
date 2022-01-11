<script lang="ts">
	import Row from './Row.svelte';
	import Keyboard from './Keyboard.svelte';
	import { WordBoard } from '../WordBoard/WordBoard';
	import type { KeyIndicator, LetterIndicator } from '../WordBoard/interface';

	let tilesArr;
	let rowsArr;
	let rowsCount = 6;
	let inputsDisabled = false;
	let rowIndicators: LetterIndicator[][] = [];
	let keyIndicators: KeyIndicator = {};
	const numberOfLetters = 5;

	let game = new WordBoard({
		tiles: numberOfLetters,
		rows: rowsCount
	});
	let boardState = game.getBoardState();

	game.registerEvents({
		onInvalidWord: () => {
			console.log('triggered invalid word');
		},
		onValidWord: (result, keyInd) => {
			rowIndicators.push(result);
			keyIndicators = keyInd;
		},
		onGameCompleted: (result: boolean, word: string) => {
			console.log('GAME IS COMPLETE.. with result: ', result);
			if (!result) {
				console.log(`Sorry... Correct word was ${word}`);
			}
		}
	});

	tilesArr = Array.from({ length: numberOfLetters }, (x, i) => i);
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
		handleInput(e.detail);
	}

	function handleKeyboardInput(e) {
		handleInput(e.key);
	}

	export function getHint(): void {
		const letter = game.getHint();
		handleInput(letter);
	}
</script>

<svelte:body on:keyup={handleKeyboardInput} />
<section class="flex flex-col h-full justify-between items-center">
	<div id="board" class="font-bold h-96 w-full md:w-96 grid grid-rows-6 gap-0.5 overflow-hidden">
		{#each rowsArr as row}
			<Row
				tiles={tilesArr}
				{row}
				entered={boardState.boardState}
				submissions={boardState.submitted}
				indicators={rowIndicators}
			/>
		{/each}
		<div class="h-4" />
	</div>
	<Keyboard on:tap={handleTap} {keyIndicators} />
</section>

<style>
</style>
