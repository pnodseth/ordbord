<script lang="ts">
	import Key from './Key.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleTap(e) {
		dispatch('tap', e);
	}
</script>

<div id="keyboard" class="w-96 m-auto">
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		{#each ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as key}
			<Key {key} on:click={() => handleTap(key)} />
		{/each}
	</div>
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		<div class="spacer half" />
		{#each ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as key}
			<Key {key} on:click={() => handleTap(key)} />
		{/each}
		<div class="spacer half" />
	</div>
	<div class="row flex w-full mt-0 mx-auto mb-0.5">
		<Key key="Enter" on:click={() => handleTap('Enter')} />
		{#each ['z', 'x', 'c', 'v', 'b', 'n', 'm'] as key}
			<Key {key} on:click={() => handleTap(key)} />
		{/each}
		<Key key="Back" on:click={() => handleTap('Back')} />
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
