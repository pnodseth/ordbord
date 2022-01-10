<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';
	import { WordBoard } from '../components/WordBoard';

	let tiles;
	let rows;
	let inputsDisabled = false;
	const solution = 'pharm';
	let game = new WordBoard({
		tiles: 5,
		rows: 6,
		solution
	});
	let boardState = game.boardState;
	game.registerEvents({
		onInvalidWord: () => {
			console.log('triggered invalid word');
		},
		onValidWord: () => {
			console.log('WORD WAS VALID! Submitted now');
		},
		onGameCompleted: () => {
			console.log('GAME IS COMPLETE.. MUAAH');
		}
	});

	tiles = Array.from({ length: game.numberOfTiles }, (x, i) => i);
	rows = Array.from({ length: game.numberOfRows }, (x, i) => i);

	function handleTap(e) {
		if (inputsDisabled) {
			return;
		}
		const { updatedBoardState, gameCompleted } = game.addLetter(e.detail);
		console.log('updated: ', updatedBoardState);
		boardState = updatedBoardState;

		if (gameCompleted) {
			console.log('game completed!!!');
		}
	}
</script>

<h1>Ordbord</h1>
<main>
	<div id="board" class="font-bold h-96 m-auto w-80 grid grid-rows-6 gap-0.5">
		{#each rows as row}
			<Row {tiles} {row} entered={boardState.boardState} />
		{/each}
	</div>
	<Keyboard on:tap={handleTap} />
</main>

<style>
</style>
