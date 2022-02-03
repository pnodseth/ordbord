<script lang="ts">
	import { fade } from 'svelte/transition';
	import Row from './Row.svelte';
	import Keyboard from './Keyboard.svelte';
	import { WordBoard } from '../WordBoard/WordBoard';
	import type {
		BoardState,
		KeyIndicator,
		LetterIndicator,
		Result,
		UiState
	} from '../WordBoard/interface';

	import { onMount } from 'svelte';
	import Won from './Modals/Won.svelte';

	export let wordIdx;
	let uiState: UiState = 'idle';
	let solution = '';

	let cachedResults: Result[] = [];
	let showWonModal = false;

	let tilesArr = [];
	let rowsArr = [];
	let rowsCount = 6;
	let inputsDisabled = false;
	let rowIndicators: LetterIndicator[][] = [];
	let keyIndicators: KeyIndicator = {};
	let displayInvalidRow: number;
	const numberOfLetters = 5;
	let game: WordBoard;
	let boardState: BoardState;

	onMount(() => {
		// First, check if we have a cached result for today:
		const cachedResultsString = localStorage.getItem('results');
		if (cachedResultsString) {
			cachedResults = JSON.parse(cachedResultsString);
			const resultToday = cachedResults.find((e) => e.wordIdx === wordIdx);
			if (resultToday) {
				rowIndicators = resultToday.rowIndicators;
				uiState = resultToday.state;
				boardState = resultToday.boardState;
				keyIndicators = resultToday.keyIndicators;
				solution = resultToday.solution;

				if (uiState !== 'idle') {
					showWonModal = true;
				}
			}
		}
		startNewGame(5, 6, wordIdx, boardState, rowIndicators, keyIndicators);
	});

	function resetState() {
		rowIndicators = [];
		keyIndicators = {};
		boardState = undefined;
	}

	function startNewGame(
		wordLength: number,
		rows: number,
		wordIdx: number,
		initialBoardState: BoardState,
		indicators: LetterIndicator[][],
		kIndicators: KeyIndicator
	): void {
		resetState();

		rowIndicators = indicators;
		keyIndicators = kIndicators;

		game = new WordBoard({
			tiles: wordLength,
			rows: rows,
			wordIdx,
			boardState: initialBoardState
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
				handleResult(result, word);
			}
		});

		tilesArr = Array.from({ length: numberOfLetters }, (x, i) => i);
		rowsArr = Array.from({ length: rowsCount }, (x, i) => i);
	}

	function handleResult(won: boolean, word: string) {
		solution = word;
		uiState = won ? 'won' : 'fail';
		showWonModal = true;

		const result: Result = {
			boardState,
			keyIndicators,
			rowIndicators,
			state: uiState,
			wordIdx,
			solution: solution
		};
		cachedResults.push(result);
		localStorage.setItem('results', JSON.stringify(cachedResults));
	}

	function handleInput(key) {
		let result = game.addLetter(key);
		if (result) {
			boardState = result;
		}
	}
	function handleTap(e) {
		if (inputsDisabled || uiState !== 'idle') {
			return;
		}

		handleInput(e.detail);
	}

	function handleKeyboardInput(e) {
		if (uiState === 'idle') {
			handleInput(e.key);
		}
	}
</script>

<svelte:body on:keyup={handleKeyboardInput} />
{#if boardState}
	<section
		class="flex flex-col h-full justify-between items-center xl:pt-40"
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
		{#if uiState !== 'idle' && showWonModal}
			<Won on:close={() => (showWonModal = false)} {uiState} {solution} {rowIndicators} {wordIdx} />
		{/if}
	</section>
{/if}
