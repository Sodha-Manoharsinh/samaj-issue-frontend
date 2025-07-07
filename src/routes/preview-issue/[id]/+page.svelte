<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/api';
	import UpvoteButton from '$lib/feed/UpvoteButton.svelte';
	import Comments from '$lib/feed/Comments.svelte';
	import { user } from '$lib/auth';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let issue = null;
	let creator = null;
	let summary = null;
	let error = '';
	let loading = true;

	let editing = false;
	let isOwnerOrAdmin = false;

	let editable = {
		title: '',
		description: '',
		location: '',
		image: null
	};

	onMount(async () => {
		const id = $page.params.id;
		const currentUser = get(user);

		try {
			const res = await api.get(`/issues/${id}`);
			issue = res.data;

			const creatorRes = await api.get(`/user/${issue.created_by}`);
			creator = creatorRes.data;

			const summaryRes = await api.get(`/issues/${id}/summary`);
			summary = summaryRes.data;

			isOwnerOrAdmin = currentUser?.id === issue.created_by || currentUser?.role === 'admin';

			editable.title = issue.title;
			editable.description = issue.description;
			editable.location = issue.location;
		} catch (err) {
			console.error('Failed to fetch issue:', err);
			error = 'Issue not found or failed to load.';
		} finally {
			loading = false;
		}
	});

	async function saveChanges() {
		const formData = new FormData();
		formData.append('title', editable.title);
		formData.append('description', editable.description);
		formData.append('location', editable.location);
		if (editable.image) formData.append('image', editable.image);

		try {
			await api.put(`/issues/${issue.id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			location.reload();
		} catch (err) {
			console.error('Update failed:', err);
			error = 'Update failed';
		}
	}

	async function deleteIssue() {
		if (!confirm('Are you sure you want to delete this issue?')) return;
		try {
			await api.delete(`/issues/${issue.id}`);
			goto('/feed');
		} catch (err) {
			console.error('Delete failed:', err);
			error = 'Delete failed';
		}
	}
</script>

<div class="container py-4">
	{#if loading}
		<p class="text-center">Loading issue...</p>
	{:else if error}
		<p class="text-danger text-center">{error}</p>
	{:else}
		<div class="issue-preview-wrapper d-flex flex-column flex-md-row gap-4">
			<!-- Left Section -->
			<div class="issue-preview-card flex-grow-1">
				<a href="/feed" class="btn btn-sm back-btn mb-3">&larr; Back to Feed</a>

				<div class="d-flex align-items-center gap-3 mb-3">
					<img
						src={creator?.picture_url || '/default.png'}
						alt={creator?.name}
						class="profile-img"
					/>
					<div>
						<h5 class="mb-0">{creator?.name}</h5>
						<small class="location-text">{issue.location}</small>
					</div>
				</div>

				{#if editing}
					<input bind:value={editable.title} class="form-control mb-2" />
				{:else}
					<h4 class="fw-bold">{issue.title}</h4>
				{/if}

				{#if issue.image_url && !editing}
					<img src={issue.image_url} alt={issue.title} class="preview-img mb-3" />
				{/if}

				{#if editing}
					<textarea bind:value={editable.description} class="form-control mb-2"></textarea>
				{:else}
					<p>{issue.description}</p>
				{/if}

				{#if editing}
					<input bind:value={editable.location} class="form-control mb-2" />
				{:else}
					<p><strong>Location:</strong> {issue.location}</p>
				{/if}

				<p><strong>Status:</strong> {issue.status}</p>

				{#if editing}
					<div class="mb-2">
						<label for="imageUpload" class="form-label">Change Image</label>
						<input
							type="file"
							id="imageUpload"
							accept="image/*"
							class="form-control"
							on:change={(e) => (editable.image = e.target.files[0])}
						/>
					</div>
				{/if}

				{#if summary}
					<div class="mt-3 p-3 rounded summary-box">
						<h6 class="fw-bold">Summary:</h6>
						<p>{summary.text}</p>
					</div>
				{/if}

				<div class="mt-4">
					<UpvoteButton issueId={issue.id} />
				</div>

				{#if isOwnerOrAdmin}
					<div class="d-flex gap-2 mt-4">
						<button class="btn btn-outline-primary btn-sm" on:click={() => (editing = !editing)}>
							{editing ? 'Cancel' : 'Edit'}
						</button>
						{#if editing}
							<button class="btn btn-success btn-sm" on:click={saveChanges}>Save</button>
						{/if}
						<button class="btn btn-outline-danger btn-sm" on:click={deleteIssue}>Delete</button>
					</div>
				{/if}
			</div>

			<!-- Right Section (comments) -->
			<div class="comments-sidebar d-none d-md-block">
				<Comments issueId={issue.id} />
			</div>
		</div>

		<!-- Comments for mobile -->
		<div class="d-block d-md-none mt-4">
			<Comments issueId={issue.id} />
		</div>
	{/if}
</div>

<style>
	:global(html, body) {
		min-height: 100vh;
		overflow-y: auto !important;
	}

	.issue-preview-wrapper {
		align-items: flex-start;
		background: var(--bg-linear);
		flex-wrap: nowrap;
		width: 100%;
	}

	.issue-preview-card {
		background: var(--card-bg);
		padding: 1.5rem;
		border-radius: var(--border-radius);
		box-shadow: var(--card-shadow);
		color: var(--text);
	}

	.back-btn {
		background: var(--action-bg);
		color: var(--text);
		border: none;
		box-shadow: var(--btn-shadow);
		transition: var(--transition);
	}

	.back-btn:hover {
		background: var(--primary);
		color: #fff;
	}

	.profile-img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--primary);
	}

	.preview-img {
		width: 100%;
		border-radius: var(--border-radius);
		object-fit: cover;
		max-height: 400px;
	}

	.summary-box {
		background: var(--bg-light);
		border-left: 4px solid var(--primary);
	}

	.comments-sidebar {
		width: 100%;
		max-width: 350px;
		flex-shrink: 0;
		background: var(--card-bg);
		padding: 1rem;
		border-radius: var(--border-radius);
		box-shadow: var(--card-shadow);
	}

	.location-text {
		color: var(--text-muted);
	}
</style>
