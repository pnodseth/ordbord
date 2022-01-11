<script lang="ts">
	import Key from './Key.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { KeyIndicator } from '../WordBoard/interface';

	export let keyIndicators: KeyIndicator = {};
	const dispatch = createEventDispatcher();

	function handleTap(e) {
		dispatch('tap', e);
	}
</script>

<div id="keyboard" class="w-full">
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		{#each ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å'] as key}
			<Key {key} on:click={() => handleTap(key)} {keyIndicators} />
		{/each}
	</div>
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		<div class="spacer half" />
		{#each ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ø', 'æ'] as key}
			<Key {key} on:click={() => handleTap(key)} {keyIndicators} />
		{/each}
		<div class="spacer half" />
	</div>
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		<Key key="Enter" on:click={() => handleTap('Enter')} />
		{#each ['z', 'x', 'c', 'v', 'b', 'n', 'm'] as key}
			<Key {key} on:click={() => handleTap(key)} {keyIndicators} />
		{/each}
		<Key key="Backspace" on:click={() => handleTap('Backspace')} />
	</div>
</div>

<style>
	#keyboard {
		user-select: none;
	}

	.half {
		flex: 0.5;
	}
</style>
