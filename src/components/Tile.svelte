<script lang="ts">
	export let tile: number;
	export let row: number;
	export let entered: string[][] = [];

	export let tileText: string;

	$: {
		tileText = entered[row][tile];
	}
</script>

<p class="border-gray-200 border-2 flex justify-center items-center">{tileText}</p>
