<script lang="ts">
	import { fade } from 'svelte/transition';
	import Row from './Row.svelte';
	import Keyboard from './Keyboard.svelte';
	import { WordBoard } from '../WordBoard/WordBoard';
	import type { BoardState, KeyIndicator, LetterIndicator } from '../WordBoard/interface';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let tilesArr = [];
	let rowsArr = [];
	let rowsCount = 6;
	let inputsDisabled = false;
	let rowIndicators: LetterIndicator[][] = [];
	let keyIndicators: KeyIndicator = {};
	let displayInvalidRow: number;
	const numberOfLetters = 5;
	export let game: WordBoard;
	let boardState: BoardState;

	function resetState() {
		rowIndicators = [];
		keyIndicators = {};
		boardState = undefined;
	}

	export function startNewGame(wordLength: number, rows: number, solution?: string): void {
		resetState();
		game = new WordBoard({
			tiles: wordLength,
			rows: rows,
			solution: solution || null
		});
		boardState = game.getBoardState();

		game.registerEvents({
			onInvalidWord: (word, rowIdx) => {
				displayInvalidRow = rowIdx;
				setTimeout(() => {
					displayInvalidRow = null;
				}, 500);
			},
			onValidWord: (result, keyInd) => {
				rowIndicators.push(result);
				keyIndicators = keyInd;
			},
			onGameCompleted: (result: boolean, word: string) => {
				dispatch('result', { status: result === false ? 'fail' : 'won', word });
			}
		});
		tilesArr = Array.from({ length: numberOfLetters }, (x, i) => i);
		rowsArr = Array.from({ length: rowsCount }, (x, i) => i);
	}

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
{#if boardState}
	<section
		class="flex flex-col h-full justify-between items-center"
		transition:fade={{ duration: 140 }}
	>
		<div id="board" class="font-bold h-96 w-full md:w-96 grid grid-rows-6 gap-0.5 overflow-hidden">
			{#each rowsArr as row}
				<Row
					tiles={tilesArr}
					{row}
					entered={boardState.boardState}
					submissions={boardState.submitted}
					indicators={rowIndicators}
					{displayInvalidRow}
				/>
			{/each}
			<div class="h-4" />
		</div>
		<Keyboard on:tap={handleTap} {keyIndicators} />
	</section>
{/if}
