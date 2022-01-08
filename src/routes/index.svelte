<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';

	const tiles = [0, 1, 2, 3, 4];
	const rows = [0, 1, 2, 3, 4, 5];

	let inputRow = 0;
	let inputTile = 0;
	let entered = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];
	let inputsDisabled = false;
	let gameCompleted = false;
	let rowCompleted = false;

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
				console.log(inputRow);
				startNewRow();
				console.log(inputRow);
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
			inputTile--;
		}
		addInputToTile('');
	}

	function isBackSpace(key) {
		return key == 'Back';
	}

	function isAllowedToBackSpace() {
		// Check if we are not at the first letter
		return inputTile != 0;
	}

	function isAllowedKey(key) {
		return !(key == 'Enter' || key == 'Back');
	}

	function addInputToTile(letter) {
		entered[inputRow][inputTile] = letter;
	}

	function submitWord() {
		const submittedWord = entered[inputRow];

		console.log('submitted: ', submittedWord.join(''));
	}

	function isRowCompleted() {
		return inputTile == 4;
	}

	function isGameCompleted() {
		return inputTile == 4 && inputRow == 5;
	}

	function startNewRow() {
		rowCompleted = false;
		inputRow++;
		inputTile = 0;
	}

	function nextTile() {
		inputTile++;
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
</script>

<h1>Ordbord</h1>
<main>
	<div id="board" class="font-bold h-96 m-auto w-80 grid grid-rows-6 gap-0.5">
		{#each rows as row}
			<Row {tiles} {row} {entered} />
		{/each}
	</div>
	<Keyboard on:tap={handleTap} />
</main>

<style>
</style>
