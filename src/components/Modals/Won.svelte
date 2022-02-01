<script lang="ts">
	import Modal from '../Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { UiState } from '../../WordBoard/interface';

	type CopyState = 'idle' | 'copying' | 'copied' | 'error';
	let copyState: CopyState = 'idle';
	export let uiState: UiState;
	export let solution = '';
	export let rowIndicators;
	export let wordIdx;

	function handleShare() {
		updateClipboard();
	}

	function parseIndicators() {
		if (rowIndicators) {
			let output = `Ordbord ${wordIdx} ${uiState === 'won' ? rowIndicators.length : 'X'}/6\n`;
			rowIndicators.forEach((rowArr, idx) => {
				if (idx !== 0) {
					output += '\n';
				}
				rowArr.forEach((letter) => {
					switch (letter) {
						case 'notPresent':
							output += '⬜';
							break;
						case 'present':
							output += '🟨';
							break;
						case 'correct':
							output += '🟩';
							break;
					}
				});
			});

			return output;
		}
	}

	function updateClipboard() {
		copyState === 'copying';
		let shareResult = parseIndicators();

		navigator.clipboard
			.writeText(shareResult)
			.then(() => {
				copyState = 'copied';
				console.log(`"${shareResult}" was copied to clipboard.`);
			})
			.catch((err) => {
				copyState = 'error';
				console.error(`Error copying text to clipboard: ${shareResult}`);

				console.log(err);
			});
	}
</script>

<Modal on:close>
	<div class="text-center pb-4 bg-white sm:w-[300px] w-full py-8 pb-10 px-12 rounded-2xl">
		{#if uiState === 'fail'}
			<p>Riktig ord: {solution.toUpperCase()}</p>
		{:else}
			<p>Gratulerer!!!!</p>
		{/if}
		<div class="h-4 mb-4" />
		{#if copyState === 'copied'}
			<p>Resultatet er kopiert til utklippstavlen.</p>
		{:else if copyState === 'idle'}
			<button
				on:click|stopPropagation={handleShare}
				class="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
				>Del resultat</button
			>
		{:else if copyState === 'error'}
			<p>Det var et problem med å kopiere resultatet.</p>
		{:else}
			<p>Kopierer...</p>
		{/if}
	</div>
</Modal>
