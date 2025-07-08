<script>
	import MobileNavbar from '$lib/navbar/MobileNavbar.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
</script>

<Navbar />
<section style="margin-top: 5rem;" class="pb-5">
	<slot />
</section>
<MobileNavbar />
