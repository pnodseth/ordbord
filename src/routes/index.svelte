<script lang="ts">
	import GameBoard from '../components/GameBoard.svelte';
	import Header from '../components/Header.svelte';
	import WrongWord from '../components/Modals/WrongWord.svelte';
	import { onMount } from 'svelte';
	import Won from '../components/Modals/Won.svelte';
	import Explanation from '../components/Modals/Explanation.svelte';
	import type { BoardState, KeyIndicator, LetterIndicator } from '../WordBoard/interface';
	import differenceInDays from 'date-fns/differenceInDays';

	interface Result {
		wordIdx: number;
		rowIndicators: LetterIndicator[][];
		state: UiState;
		boardState: BoardState;
		keyIndicators: KeyIndicator;
	}

	let getHint: () => void;
	let showExplanation = false;
	let rowIndicators: LetterIndicator[][] = [];
	let startNewGame: (
		wordLength: number,
		rows: number,
		wordIdx: number,
		initialBoardState: BoardState | null,
		rowIndicators: LetterIndicator[][],
		keyIndicators: KeyIndicator
	) => void;
	type UiState = 'idle' | 'fail' | 'won';
	let uiState: UiState = 'idle';
	let solution = '';
	const firstDate = new Date(2022, 0, 31);
	const today = new Date();
	const wordIdx = differenceInDays(today, firstDate);
	let cachedResults: Result[] = [];
	let initialBoardState: BoardState;
	let initialKeyIndicators: KeyIndicator;

	let showWonModal = false;

	function handleStartNew() {
		uiState = 'idle';
		startNewGame(5, 6, wordIdx, initialBoardState, rowIndicators, initialKeyIndicators);
	}

	onMount(() => {
		// First, check if we have a cached result for today:
		const cachedResultsString = localStorage.getItem('results');
		if (cachedResultsString) {
			cachedResults = JSON.parse(cachedResultsString);
			const resultToday = cachedResults.find((e) => e.wordIdx === wordIdx);
			if (resultToday) {
				rowIndicators = resultToday.rowIndicators;
				uiState = resultToday.state;
				initialBoardState = resultToday.boardState;
				initialKeyIndicators = resultToday.keyIndicators;
			}
		}
		console.log({ initialBoardState }, initialBoardState);
		startNewGame(5, 6, wordIdx, initialBoardState, rowIndicators, initialKeyIndicators);
		const shown = localStorage.getItem('explanation');
		if (!shown) {
			showExplanation = true;
			localStorage.setItem('explanation', JSON.stringify(true));
		}
	});

	function handleResult(e) {
		const { status, word, rowIndicators: indicators, boardState, kIndicators } = e.detail;

		solution = word;
		uiState = status;
		rowIndicators = indicators;
		showWonModal = status === 'won' ? true : false;

		const result: Result = {
			rowIndicators,
			state: status,
			wordIdx,
			boardState,
			keyIndicators: kIndicators
		};
		cachedResults.push(result);
		localStorage.setItem('results', JSON.stringify(cachedResults));
	}

	function parseIndicators() {
		if (rowIndicators) {
			let output = `Ordbord ${wordIdx} ${uiState === 'won' ? rowIndicators.length : 'X'}/6\n`;
			rowIndicators.forEach((rowArr, idx) => {
				if (idx !== 0) {
					output += '\n';
				}
				rowArr.forEach((letter) => {
					switch (letter) {
						case 'notPresent':
							output += '⬜';
							break;
						case 'present':
							output += '🟨';
							break;
						case 'correct':
							output += '🟩';
							break;
					}
				});
			});

			return output;
		}
	}

	function updateClipboard() {
		let shareResult = parseIndicators();
		console.log(shareResult);

		navigator.permissions
			// eslint-disable-next-line no-undef
			.query(<PermissionDescriptor>{ name: 'clipboard-write' })
			.then((result) => {
				if (result.state == 'granted' || result.state == 'prompt') {
					/* write to the clipboard now */
				}
			});

		navigator.clipboard.writeText(shareResult);
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
		<WrongWord on:click={handleStartNew} on:share={updateClipboard}>
			<p>Riktig ord: {solution.toUpperCase()}</p>
		</WrongWord>
	{/if}
	{#if showWonModal}
		<Won on:click={handleStartNew} on:share={updateClipboard}><p>Gratulerer!</p></Won>
	{/if}
</main>
