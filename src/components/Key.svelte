<script lang="ts">
	export let key: string;
</script>

<button
	on:click
	class="font-bold border-0 p-0 mt-0 mr-1 mb-0 ml-0 bg-gray-500 text-white flex-1 flex justify-center items-center cursor-pointer uppercase"
	>{key}</button
>

<style>
	button {
		height: 58px;
		border-radius: 4px;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
	}
</style>
