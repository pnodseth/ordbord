<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';
	import { onMount } from 'svelte';

	let numberOfTiles = 5;
	let numberOfRows = 6;

	let tiles = [];
	let rows = [];

	let currentRowIdx = 0;
	let currentTileIdx = 0;
	let entered = [];
	let inputsDisabled = false;
	let gameCompleted = false;
	let rowCompleted = false;

	function setupBoard() {
		tiles = Array.from({ length: numberOfTiles }, (x, i) => i);
		rows = Array.from({ length: numberOfRows }, (x, i) => i);

		for (let i = 0; i < numberOfRows; i++) {
			if (!entered[i]) {
				entered[i] = [];
			}
			for (let j = 0; j < numberOfTiles; j++) {
				if (entered[i][j]) {
					entered[i][j] = [];
				}
				entered[i][j] = '';
			}
		}
	}

	onMount(() => {
		setupBoard();
	});

	function handleTap(e) {
		if (inputsDisabled) {
			return;
		} else if (gameCompleted) {
			if (e.detail === 'Enter') {
				submitWord();
				console.log('Thank you for playing!');
				inputsDisabled = true;
			}

			return;
		} else if (rowCompleted) {
			if (e.detail === 'Enter') {
				submitWord();
				console.log(currentRowIdx);
				startNewRow();
				console.log(currentRowIdx);
			} else if (e.detail == 'Back') {
				deleteLastLetter();
				rowCompleted = false;
			}
			return;
		} else {
			// Continue adding / removing letters
			if (isBackSpace(e.detail) && isAllowedToBackSpace()) {
				deleteLastLetter();
			} else if (isAllowedKey(e.detail)) {
				addInputToTile(e.detail);

				updateGame();
			}
		}
	}

	function deleteLastLetter() {
		if (!rowCompleted) {
			currentTileIdx--;
		}
		addInputToTile('');
	}

	function isBackSpace(key) {
		return key == 'Back';
	}

	function isAllowedToBackSpace() {
		// Check if we are not at the first letter
		return currentTileIdx != 0;
	}

	function isAllowedKey(key) {
		return !(key == 'Enter' || key == 'Back');
	}

	function addInputToTile(letter) {
		entered[currentRowIdx][currentTileIdx] = letter;
	}

	function submitWord() {
		const submittedWord = entered[currentRowIdx];

		console.log('submitted: ', submittedWord.join(''));
	}

	function isRowCompleted() {
		return currentTileIdx == numberOfTiles - 1;
	}

	function isGameCompleted() {
		return currentTileIdx == numberOfTiles - 1 && currentRowIdx == numberOfRows - 1;
	}

	function startNewRow() {
		rowCompleted = false;
		currentRowIdx++;
		currentTileIdx = 0;
	}

	function nextTile() {
		currentTileIdx++;
	}

	function updateGame() {
		if (isGameCompleted()) {
			gameCompleted = true;
			console.log('Game is completed');
		} else if (isRowCompleted()) {
			console.log('Row is completed');
			rowCompleted = true;
		} else {
			console.log('next tile');
			nextTile();
		}
	}

	function changeLayout() {
		numberOfTiles = 8;
		numberOfRows = 8;
		setupBoard();
	}
</script>

<h1>Ordbord</h1>
<main>
	<div id="board" class="font-bold h-96 m-auto w-80 grid grid-rows-{numberOfRows} gap-0.5">
		{#each rows as row}
			<Row {tiles} {row} {entered} />
		{/each}
	</div>
	<Keyboard on:tap={handleTap} />
	<button on:click={changeLayout}>test</button>
</main>

<style>
</style>
