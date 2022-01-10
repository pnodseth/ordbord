<script lang="ts">
	import Tile from './Tile.svelte';

	export let tiles: number[] = [];
	export let row: number;
	export let entered: string[][];
	export let solution: string;
</script>

<div id="row" class="grid grid-cols-5 gap-1">
	{#each tiles as tile}
		<Tile {tile} {row} {entered} {solution} />
	{/each}
</div>
