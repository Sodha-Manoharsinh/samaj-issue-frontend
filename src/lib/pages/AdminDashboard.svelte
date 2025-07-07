<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import FeedPage from '$lib/feed/FeedPage.svelte';
	import { user } from '$lib/auth';
	import { goto } from '$app/navigation';

	let stats = { Pending: 0, 'In Progress': 0, Resolved: 0 };
	let selectedStatus = null;
	let error = '';
	let loading = true;

	onMount(async () => {
		if (user.role == 'user') goto('/');
		await fetchStats();
	});

	async function fetchStats() {
		loading = true;
		try {
			const res = await api.get('/admin/stats');
			stats = res.data;
		} catch (err) {
			console.error('Failed to load stats:', err);
			error = 'Failed to load stats.';
		} finally {
			loading = false;
		}
	}
</script>

<section class="admin-dashboard">
	<h2 class="heading">🛠️ Admin Dashboard</h2>

	{#if loading}
		<p>Loading stats...</p>
	{:else if error}
		<p class="text-danger">{error}</p>
	{:else}
		<!-- 📊 Status Overview -->
		<div class="stats-container">
			<div class="stat-box pending">
				<span class="label">Pending</span>
				<span class="count">{stats.Pending}</span>
			</div>
			<div class="stat-box in-progress">
				<span class="label">In Progress</span>
				<span class="count">{stats['In Progress']}</span>
			</div>
			<div class="stat-box resolved">
				<span class="label">Resolved</span>
				<span class="count">{stats.Resolved}</span>
			</div>
		</div>

		<!-- 🔽 Filter Dropdown -->
		<div class="filter-box">
			<label for="status">Filter by status:</label>
			<select id="status" bind:value={selectedStatus} class="form-select">
				<option value={null}>All</option>
				<option value="Pending">Pending</option>
				<option value="In Progress">In Progress</option>
				<option value="Resolved">Resolved</option>
			</select>
		</div>

		<!-- 📰 FeedPage with Filter -->
		<FeedPage statusFilter={selectedStatus} />
	{/if}
</section>

<style>
	.admin-dashboard {
		padding: 2rem;
		color: var(--text);
		background: var(--bg);
		min-height: 100vh;
	}

	.heading {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: var(--text);
	}

	.stats-container {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.stat-box {
		flex: 1;
		min-width: 160px;
		background: var(--card-bg);
		padding: 1rem;
		border-radius: var(--border-radius);
		box-shadow: var(--card-shadow);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.stat-box .label {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}

	.stat-box .count {
		font-size: 1.6rem;
		font-weight: 600;
		color: var(--text);
	}

	.stat-box.pending {
		border-left: 5px solid #f39c12;
	}

	.stat-box.in-progress {
		border-left: 5px solid #3498db;
	}

	.stat-box.resolved {
		border-left: 5px solid #2ecc71;
	}

	.filter-box {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.filter-box label {
		font-weight: 500;
		color: var(--text);
	}

	select.form-select {
		padding: 0.5rem 0.75rem;
		background: var(--card-bg);
		color: var(--text);
		border: 1px solid var(--border);
		border-radius: var(--border-radius);
	}
</style>
