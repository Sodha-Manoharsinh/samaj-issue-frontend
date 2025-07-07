<script>
	import MobileNavbar from '$lib/navbar/MobileNavbar.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import FeedPage from '$lib/feed/FeedPage.svelte';
</script>

<Navbar />
<section style="margin-top: 5rem; background:var(--bg-linear)">
	<FeedPage />
</section>
<MobileNavbar />
