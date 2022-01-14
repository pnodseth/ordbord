<script lang="ts">
	import Modal from '../Modal.svelte';
</script>

<Modal>
	<div class="text-center w-40 pb-4 ">
		<slot />
		<div class="h-4" />
		<button on:click class="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
			>Prøv igjen</button
		>
	</div>
</Modal>
