<script lang="ts">
	import Row from '../components/Row.svelte';
	import Keyboard from '../components/Keyboard.svelte';
	import { OrdBord } from '../components/OrdBord';

	let tiles;
	let rows;
	let inputsDisabled = false;
	let game = new OrdBord({ tiles: 5, rows: 6 });
	let userEntries = game.userEntries;

	tiles = Array.from({ length: game.numberOfTiles }, (x, i) => i);
	rows = Array.from({ length: game.numberOfRows }, (x, i) => i);

	function handleTap(e) {
		if (inputsDisabled) {
			return;
		}
		const { updatedEntries, disableInputs, rowCompleted, rowSubmitted, gameCompleted } =
			game.handleTap(e.detail);
		inputsDisabled = disableInputs;
		userEntries = updatedEntries;

		if (rowCompleted) {
			console.log('I CAN HOOK INTO THIS!!!');
		}
		if (rowSubmitted) {
			console.log('ROOOW WAS SUBMITTED');
		}
		if (gameCompleted) {
			console.log('game completed!!!');
		}
	}
</script>

<h1>Ordbord</h1>
<main>
	<div id="board" class="font-bold h-96 m-auto w-80 grid grid-rows-{game.numberOfRows} gap-0.5">
		{#each rows as row}
			<Row {tiles} {row} entered={userEntries} />
		{/each}
	</div>
	<Keyboard on:tap={handleTap} />
</main>

<style>
</style>
