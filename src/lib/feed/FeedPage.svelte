<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import { token, user } from '$lib/auth';
	import { get } from 'svelte/store';
	import UpvoteButton from './UpvoteButton.svelte';

	export let userId = null;
	export let statusFilter = null;

	let issues = [];
	let search = '';
	let filteredIssues = [];
	let loading = true;
	let limit = 6;
	let offset = 0;
	let isFetchingMore = false;
	let currentUser = get(user);
	const fetchedIds = new Set();

	async function fetchIssues(initial = false) {
		if (initial) {
			issues = [];
			offset = 0;
			fetchedIds.clear();
		}
		if (isFetchingMore) return;
		isFetchingMore = true;

		try {
			const res = await api.get(`/issues?limit=${limit}&offset=${offset}`);
			const rawIssues = res.data;

			const newIssues = rawIssues.filter((i) => !fetchedIds.has(i.id));
			if (newIssues.length === 0) {
				isFetchingMore = false;
				return;
			}

			const enriched = await Promise.all(
				newIssues.map(async (issue) => {
					const userRes = await api.get(`/user/${issue.created_by}`);
					return { ...issue, user: userRes.data };
				})
			);

			const finalIssues = enriched
				.filter((i) => (userId ? i.created_by === userId : true))
				.filter((i) => (statusFilter ? i.status === statusFilter : true));

			finalIssues.forEach((i) => fetchedIds.add(i.id));
			issues = [...issues, ...finalIssues];
			filterIssues();

			offset += limit;
		} catch (e) {
			console.error('Error fetching issues:', e);
		} finally {
			isFetchingMore = false;
			loading = false;
		}
	}

	function filterIssues() {
		filteredIssues = issues.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));
	}

	async function updateStatus(issueId, newStatus) {
		try {
			await api.put(`/admin/issues/${issueId}/status`, { status: newStatus });
			issues = issues.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i));
			filterIssues();
		} catch (e) {
			console.error('Status update failed:', e);
		}
	}

	function handleScroll(e) {
		const nearBottom = e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 100;
		if (nearBottom) {
			fetchIssues();
		}
	}

	$: if (statusFilter !== undefined) {
		fetchIssues(true); // refetch from start
	}

	onMount(() => {
		fetchIssues(true);
	});
</script>

<!-- 🔍 Search Bar -->
<div class="search-bar-container">
	<input
		type="text"
		placeholder="Search issues..."
		bind:value={search}
		on:input={filterIssues}
		class="form-control shadow-sm"
	/>
</div>

<!-- 📰 Issue Feed -->
<div class="issue-feed-container" on:scroll={handleScroll}>
	{#if loading}
		<p class="text-center py-4">Loading issues...</p>
	{:else if filteredIssues.length === 0}
		<p class="text-center py-4">No issues found.</p>
	{:else}
		<div class="issue-grid">
			{#each filteredIssues as issue}
				<div class="issue-card">
					<div class="d-flex align-items-center gap-2 mb-2">
						<img
							src={issue.user.picture_url || '/default.png'}
							alt={issue.user.name}
							class="profile-img"
						/>
						<div>
							<strong class="user-name">{issue.user.name}</strong>
							<small class="location-text">At - {issue.location}</small>
						</div>
					</div>

					{#if issue.image_url}
						<img src={issue.image_url} alt={issue.title} class="post-img" loading="lazy" />
					{/if}

					<h6 class="issue-title mt-2">{issue.title}</h6>
					<p class="issue-description">{issue.description}</p>

					<p class="mb-1"><strong>Status:</strong> {issue.status}</p>

					<div class="d-flex justify-content-between align-items-center mt-2">
						<UpvoteButton issueId={issue.id} />
						<a href={`/preview-issue/${issue.id}`} class="btn btn-sm btn-outline-primary">
							Read More
						</a>
					</div>

					{#if currentUser?.role === 'admin'}
						<select
							class="form-select form-select-sm mt-2"
							bind:value={issue.status}
							on:change={(e) => updateStatus(issue.id, e.target.value)}
						>
							<option disabled value="">Update Status</option>
							<option value="Pending">Pending</option>
							<option value="In Progress">In Progress</option>
							<option value="Resolved">Resolved</option>
						</select>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- 🌈 Styling -->
<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: var(--bg-linear);
	}

	.user-name {
		color: var(--text);
		display: block;
	}

	.location-text {
		color: var(--text-muted);
	}

	.search-bar-container {
		padding: 1rem;
		background: var(--bg);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 10;
	}

	.issue-feed-container {
		height: calc(100vh - 80px);
		overflow-y: auto;
		padding: 1rem;
		padding-bottom: 6rem;
		scroll-behavior: smooth;
		background: var(--bg-linear);
	}

	.issue-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
		padding-bottom: 2rem;
	}

	.issue-card {
		max-width: 500px;
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		border-radius: var(--border-radius);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		transition: var(--transition);
	}

	.issue-card:hover {
		transform: translateY(-2px);
	}

	.profile-img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--primary);
	}

	.post-img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: var(--border-radius);
		margin-top: 0.5rem;
	}

	.issue-title {
		color: var(--card-title);
		font-weight: 700;
	}

	.issue-description {
		color: var(--card-description);
		font-size: 0.9rem;
	}
</style>
