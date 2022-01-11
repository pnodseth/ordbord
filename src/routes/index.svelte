<script lang="ts">
	import GameBoard from '../components/GameBoard.svelte';
	import Header from '../components/Header.svelte';

	let getHint: () => void;
</script>

<main class="flex flex-col h-screen pb-4 max-w-md m-auto">
	<div class="h-16  mb-4 md:mb-12  flex flex-initial">
		<Header>
			<button on:click={getHint}>Click</button>
		</Header>
	</div>
	<div class="flex-1">
		<GameBoard bind:getHint />
	</div>
</main>
