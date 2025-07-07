<script>
	import MobileNavbar from '$lib/navbar/MobileNavbar.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import ProfilePage from '$lib/pages/ProfilePage.svelte';
</script>

<Navbar />
<section class="mt-lg-5">
	<ProfilePage />
</section>
<MobileNavbar />
