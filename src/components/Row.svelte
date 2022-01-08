<script lang="ts">
	import Tile from './Tile.svelte';

	export let tiles: number[] = [];
	export let row: number;
	export let entered: string[][];
</script>

<div id="row" class="grid grid-cols-{tiles.length} gap-1">
	{#each tiles as tile}
		<Tile {tile} {row} {entered} />
	{/each}
</div>
