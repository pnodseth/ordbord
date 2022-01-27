<script lang="ts">
	import Modal from '../Modal.svelte';
</script>

<Modal>
	<section class="sm:w-[500px] w-full h-1/2 min-h-[200px] bg-gray-50 px-8 py-8 rounded-2xl ">
		<h2 class="mb-2 font-bold">Gjett riktig ord på 6 forsøk.</h2>
		<p class="mb-2">Hvert forsøk må være et gyldig ord. Trykk enter for å avgi forslaget.</p>
		<p class="mb-2">
			Etter hvert forsøk vil fargen på bokstavene endre seg for å vise hvor nær du er.
		</p>
		<p class="mb-4 mt-8">
			<span class="bg-teal-500 p-2 rounded-md mr-2 leading-8 inline-block w-36 text-center"
				>Grønn bakgrunn</span
			>Bokstaven er på riktig sted.
		</p>
		<p class="mb-8">
			<span class="bg-yellow-400 p-2 rounded-md mr-2 leading-8 inline-block w-36 text-center"
				>Gul bakgrunn</span
			>Bokstaven fins i ordet, men er feil plassert.
		</p>
		<div class="w-full flex justify-center items-center">
			<button
				class="border-gray-400 border-2 px-4 py-2 rounded-2xl m-auto hover:bg-gray-200"
				on:click>Ok, la oss starte!</button
			>
		</div>
	</section>
</Modal>
