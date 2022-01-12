<script lang="ts">
	import Tile from './Tile.svelte';
	import type { LetterIndicator } from '../WordBoard/interface';

	export let tiles: number[] = [];
	export let row: number;
	export let entered: string[][];
	export let submissions: boolean[] = [];
	export let indicators: LetterIndicator[];

	let submitted: boolean;
	let colsclass = 'grid-cols-5';
	$: {
		if (row) {
			submitted = submissions[row];
		}
	}

	$: {
		if (tiles.length > 0) {
			colsclass = `grid-cols-${tiles.length}`;
		}
	}
</script>

<div class="row grid {colsclass} gap-1">
	{#each tiles as tile}
		<Tile {tile} {row} {entered} {indicators} />
	{/each}
</div>
