<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import { token } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	export let issueId;

	let upvote = { total_upvotes: 0, has_upvoted: false };

	async function fetchUpvoteStatus() {
		try {
			const res = await api.get(`/issues/${issueId}/upvotes`);
			upvote = res.data;
		} catch (err) {
			console.error('Failed to fetch upvote status:', err);
		}
	}

	async function toggleUpvote() {
		const jwt = get(token) || localStorage.getItem('token');
		if (!jwt) {
			goto('/auth/login');
			return;
		}

		try {
			await api.post(`/issues/${issueId}/upvote`, null, {
				headers: { Authorization: `Bearer ${jwt}` }
			});
			await fetchUpvoteStatus(); // refresh count & state after action
		} catch (err) {
			console.error('Failed to toggle upvote:', err);
		}
	}

	onMount(fetchUpvoteStatus);
</script>

<button
	type="button"
	class="upvote-wrapper small-button d-inline-flex align-items-center px-2 py-1 border-0"
	class:upvoted={upvote.has_upvoted}
	on:click={toggleUpvote}
>
	<span class="upvote-arrow me-1">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M8 12a.5.5 0 0 0 .5-.5V3.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 .708.708L7.5 3.707V11.5A.5.5 0 0 0 8 12z"
			/>
		</svg>
	</span>
	<span class="upvote-count fw-bold">{upvote.total_upvotes}</span>
</button>

<style>
	.small-button {
		font-size: 0.85rem;
		padding: 0.25rem 0.6rem;
	}

	.upvote-wrapper {
		background: var(--action-bg);
		cursor: pointer;
		border-radius: 999px;
		user-select: none;
		display: inline-flex;
		align-items: center;
		outline: none;
		transition:
			background 0.3s,
			transform 0.2s;
		color: var(--text);
	}

	.upvote-wrapper:hover {
		background: var(--primary);
		color: #fff;
		transform: translateY(-1px);
	}

	.upvote-wrapper.upvoted {
		background: var(--primary);
		color: #fff;
	}

	.upvote-wrapper:focus {
		box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.3);
	}

	.upvote-wrapper svg {
		pointer-events: none;
	}

	.upvote-count {
		font-size: 0.95rem;
	}
</style>
