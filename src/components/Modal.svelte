<script lang="ts">
	let test = 1;
</script>

<div
	class="modal fixed left-0 top-0 w-screen h-screen  z-10 p-4  flex justify-center items-center rounded-2xl bg-gray-100 bg-opacity-60"
>
	<div class="shadow-xl rounded-2xl">
		<slot />
	</div>
</div>
