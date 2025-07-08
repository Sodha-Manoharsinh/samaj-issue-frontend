<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '../css/app.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('bootstrap/dist/js/bootstrap.bundle.min.js');
	});
</script>

<slot />
