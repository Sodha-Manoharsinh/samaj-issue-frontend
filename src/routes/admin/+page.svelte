<script>
	import MobileNavbar from '$lib/navbar/MobileNavbar.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import AdminDashboard from '$lib/pages/AdminDashboard.svelte';
</script>

<Navbar />
<section style="margin-top: 5rem; background:var(--bg-linear)">
	<AdminDashboard />
</section>
<MobileNavbar />
