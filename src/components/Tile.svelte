<script lang="ts">
	import type { LetterIndicator } from './WordBoard';

	export let tile: number;
	export let row: number;
	export let entered: string[][] = [];
	export let indicators: LetterIndicator[];

	let tileText: string;
	let indicator: LetterIndicator;

	$: {
		tileText = entered[row][tile];

		if (indicators[row]) indicator = indicators[row][tile];
	}
</script>

<p
	class="border-gray-200 border-2 flex justify-center items-center"
	class:correct={indicator === 'correct'}
	class:present={indicator === 'present'}
	class:not-present={indicator === 'notPresent'}
>
	{tileText}
</p>

<style>
	.correct {
		background: green;
	}

	.present {
		background-color: yellow;
	}

	.not-present {
		background-color: #9ca3af;
	}
</style>
