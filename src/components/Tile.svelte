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

		if (indicators[row]) {
			indicator = indicators[row][tile];
		} else {
			indicator = null;
		}
	}
</script>

<p
	class="border-2 flex justify-center items-center rounded-sm text-2xl"
	class:correct={indicator === 'correct'}
	class:present={indicator === 'present'}
	class:not-present={indicator === 'notPresent'}
>
	{tileText?.toUpperCase()}
</p>

<style>
	p {
		border-color: #bfbfbfad;
		background: #f0f8ff36;
	}
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
