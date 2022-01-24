<script lang="ts">
	import Tile from './Tile.svelte';
	import type { LetterIndicator } from '../WordBoard/interface';

	export let tiles: number[] = [];
	export let row: number;
	export let entered: string[][];
	export let submissions: boolean[] = [];
	export let indicators: LetterIndicator[];
	export let displayInvalidRow: number;

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

<div class="row grid {colsclass} gap-1" class:shake={displayInvalidRow === row}>
	{#each tiles as tile}
		<Tile {tile} {row} {entered} {indicators} />
	{/each}
</div>

<style>
	.shake {
		/* Start the shake animation and make the animation last for 0.5 seconds */
		animation: shake 0.5s;

		/* When the animation is finished, start again */
		animation-iteration-count: infinite;
	}

	@keyframes shake {
		0% {
			transform: translate(1px, 1px) rotate(0deg);
		}
		10% {
			transform: translate(-1px, -2px) rotate(-1deg);
		}
		20% {
			transform: translate(-3px, 0px) rotate(1deg);
		}
		30% {
			transform: translate(3px, 2px) rotate(0deg);
		}
		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}
		50% {
			transform: translate(-1px, 2px) rotate(-1deg);
		}
		60% {
			transform: translate(-3px, 1px) rotate(0deg);
		}
		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}
		80% {
			transform: translate(-1px, -1px) rotate(1deg);
		}
		90% {
			transform: translate(1px, 2px) rotate(0deg);
		}
		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
</style>
