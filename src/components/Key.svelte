<script lang="ts">
	import type { KeyIndicator, LetterIndicator } from '../WordBoard/interface';

	export let key: string;
	export let keyIndicators: KeyIndicator = {};
	let indicator: LetterIndicator = null;

	$: {
		if (key && keyIndicators[key]) indicator = keyIndicators[key];
	}
</script>

<button
	on:click
	class="font-bold border-0 p-0 mt-0 mr-1 mb-0 ml-0 bg-gray-300 text-white flex-1 flex justify-center items-center cursor-pointer uppercase"
	class:correct={indicator === 'correct'}
	class:not-present={indicator === 'notPresent'}>{key}</button
>

<style>
	button {
		height: 58px;
		border-radius: 4px;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
	}

	.correct {
		background-color: green;
	}

	.not-present {
		background-color: #9ca3af;
		color: #e5e7eb;
	}
</style>
