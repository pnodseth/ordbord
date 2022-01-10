<script lang="ts">
	import Tile from './Tile.svelte';
	import type { LetterIndicator } from '../WordBoard/interface';

	export let tiles: number[] = [];
	export let row: number;
	export let entered: string[][];
	export let solution: string;
	export let submissions: boolean[] = [];
	export let indicators: LetterIndicator[];

	let submitted: boolean;

	$: {
		if (row) {
			submitted = submissions[row];
		}
	}
</script>

<div id="row" class="grid grid-cols-5 gap-1">
	{#each tiles as tile}
		<Tile {tile} {row} {entered} {solution} {indicators} />
	{/each}
</div>
