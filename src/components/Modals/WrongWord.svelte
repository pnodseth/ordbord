<script lang="ts">
	import Modal from '../Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<Modal>
	<div class="text-center pb-4 bg-white sm:w-[300px] w-full py-8 pb-10 px-12 rounded-2xl">
		<slot />
		<div class="h-4 mb-4" />
		<button
			on:click={() => dispatch('share')}
			class="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
			>Del resultat</button
		>
	</div>
</Modal>
