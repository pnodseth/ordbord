<script lang="ts">
	import type { LetterIndicator } from '../WordBoard/interface';

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
	class="border-gray-200 border-2 flex justify-center items-center rounded-sm bg-"
	class:correct={indicator === 'correct'}
	class:present={indicator === 'present'}
	class:not-present={indicator === 'notPresent'}
>
	{tileText.toUpperCase()}
</p>

<style>
	.correct {
		background: green;
		color: #fff;
		border: none;
	}

	.present {
		background-color: rgb(252, 211, 77);
		border: none;
	}

	.not-present {
		background-color: #bdc6d5;
	}
</style>
