<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import { token, user } from '$lib/auth';
	import { get } from 'svelte/store';

	export let issueId;

	let comments = [];
	let newComment = '';
	let editingId = null;
	let editingText = '';
	let loading = true;
	let error = '';
	let currentUser = null;

	onMount(async () => {
		currentUser = get(user);
		await fetchComments();
	});

	async function fetchComments() {
		loading = true;
		try {
			const res = await api.get(`/issues/${issueId}/comments`);
			comments = res.data;
		} catch (err) {
			error = 'Failed to load comments.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	async function addComment() {
		if (!newComment.trim()) return;
		try {
			await api.post(`/issues/${issueId}/add-comment`, { text: newComment });
			newComment = '';
			await fetchComments();
		} catch (err) {
			console.error('Add comment failed:', err);
		}
	}

	async function deleteComment(id) {
		if (!confirm('Are you sure you want to delete this comment?')) return;
		try {
			await api.delete(`/comments/${id}`);
			await fetchComments();
		} catch (err) {
			console.error('Delete failed:', err);
		}
	}

	async function saveEdit(id) {
		try {
			await api.put(`/comments/${id}`, { text: editingText });
			editingId = null;
			await fetchComments();
		} catch (err) {
			console.error('Edit failed:', err);
		}
	}
</script>

<!-- 💬 Comment Sidebar -->
<section class="comment-sidebar pb-5">
	<h6 class="sidebar-title">💬 Comments</h6>

	<!-- Scrollable comment section -->
	<div class="comment-list">
		{#if loading}
			<p>Loading comments...</p>
		{:else if error}
			<p class="text-danger">{error}</p>
		{:else if comments.length === 0}
			<p>No comments yet.</p>
		{:else}
			{#each comments as c}
				<div class="comment">
					<div class="comment-header d-flex align-items-center gap-2 mb-1">
						<img src={c.user?.picture_url || '/default.png'} alt="user" class="comment-avatar" />
						<div>
							<strong class="comment-user">{c.user?.name || 'Anonymous'}</strong><br />
							<small class="comment-date">{new Date(c.created_at).toLocaleString()}</small>
						</div>
					</div>

					{#if editingId === c.id}
						<textarea bind:value={editingText} rows="2" class="form-control mb-1"></textarea>
						<div class="d-flex gap-2">
							<button class="btn btn-sm btn-primary" on:click={() => saveEdit(c.id)}>Save</button>
							<button class="btn btn-sm btn-secondary" on:click={() => (editingId = null)}
								>Cancel</button
							>
						</div>
					{:else}
						<p class="comment-text">{c.text}</p>
						<div class="actions">
							{#if c.user_id === currentUser?.id}
								<!-- Owner can edit -->
								<button
									class="btn btn-sm btn-outline-primary me-1"
									on:click={() => {
										editingId = c.id;
										editingText = c.text;
									}}>Edit</button
								>

								<!-- Owner can delete -->
								<button class="btn btn-sm btn-outline-danger" on:click={() => deleteComment(c.id)}
									>Delete</button
								>
							{/if}

							{#if currentUser?.role === 'admin' && c.user_id !== currentUser?.id}
								<!-- Admin can delete others' comments -->
								<button class="btn btn-sm btn-outline-danger" on:click={() => deleteComment(c.id)}
									>Delete</button
								>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<!-- ➕ Add Comment (Fixed Bottom) -->
	<div class="add-comment">
		<textarea bind:value={newComment} class="form-control" placeholder="Add a comment..." rows="2"
		></textarea>
		<button class="btn btn-sm btn-primary mt-2 w-100" on:click={addComment}>Post Comment</button>
	</div>
</section>

<style>
	.comment-sidebar {
		background: var(--card-bg);
		padding: 1rem;
		border-radius: var(--border-radius);
		box-shadow: var(--card-shadow);
		color: var(--text);
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.sidebar-title {
		color: var(--text);
		margin-bottom: 0.75rem;
	}

	.comment-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-right: 4px;
		margin-bottom: 1rem;
	}

	.comment {
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--bg);
	}

	.comment-header {
		display: flex;
		align-items: center;
	}

	.comment-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--primary);
	}

	.comment-user {
		color: var(--text);
		font-size: 0.9rem;
	}

	.comment-date {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.comment-text {
		margin: 0.5rem 0;
		color: var(--text);
	}

	.actions button {
		font-size: 0.8rem;
	}

	.add-comment {
		position: sticky;
		bottom: 0;
		background: var(--card-bg);
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}
</style>
