<script>
	import { goto } from '$app/navigation';
	import api from '$lib/api';
	import { token } from '$lib/auth';
	import { get } from 'svelte/store';

	let title = '';
	let description = '';
	let location = '';
	let image = null;
	let message = '';
	let loading = false;

	function handleFileChange(event) {
		image = event.target.files[0];
	}

	async function createIssue() {
		message = '';
		loading = true;

		if (!title.trim() || !description.trim() || !location.trim()) {
			message = 'All fields are required.';
			loading = false;
			return;
		}

		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		formData.append('location', location);
		if (image) formData.append('image', image);

		try {
			await api.post('/new-issue', formData, {
				headers: {
					Authorization: `Bearer ${get(token)}`,
					'Content-Type': 'multipart/form-data'
				}
			});
			goto('/'); // Redirect to home or issues page
		} catch (err) {
			message = err?.response?.data?.error || 'Issue submission failed';
		} finally {
			loading = false;
		}
	}
</script>

<!-- Create Issue Card -->
<div class="d-flex justify-content-center align-items-center create-issue-container">
	<div class="card shadow create-card">
		<div class="card-body">
			<h2 class="text-center mb-4" style="color: var(--primary)">Create New Issue</h2>

			<form on:submit|preventDefault={createIssue} class="d-flex flex-column gap-3">
				<input type="text" class="form-control" placeholder="Title" bind:value={title} />
				<textarea class="form-control" placeholder="Description" rows="4" bind:value={description}
				></textarea>
				<input type="text" class="form-control" placeholder="Location" bind:value={location} />
				<input type="file" accept="image/*" class="form-control" on:change={handleFileChange} />

				<button type="submit" class="btn btn-outline-primary" disabled={loading}>
					{loading ? 'Posting...' : 'Submit Issue'}
				</button>
			</form>

			{#if message}
				<p class="text-center mt-3" style="color: var(--text-muted)">{message}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.create-issue-container {
		height: 100vh;
		background: var(--bg-linear);
		overflow: hidden;
	}

	.create-card {
		width: 90vw;
		max-width: 480px;
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		border-radius: var(--border-radius);
		transition: var(--transition);
		padding: 2rem;
	}

	@media (max-width: 576px) {
		.create-card {
			padding: 1.5rem;
		}
	}
</style>
