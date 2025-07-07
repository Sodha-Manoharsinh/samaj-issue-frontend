<script>
	import { token } from '$lib/auth';
	import api from '$lib/api';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let user = null;
	let profilePic = '/default.png';

	onMount(async () => {
		const jwt = get(token) || localStorage.getItem('token');
		if (jwt) {
			try {
				const res = await api.get('/me', {
					headers: { Authorization: `Bearer ${jwt}` }
				});
				user = res.data;
				profilePic = user?.picture_url || '/default.png';
			} catch (err) {
				console.warn('Token expired or invalid');
				token.set(null);
				localStorage.removeItem('token');
			}
		}
	});

	function handleCreate(event) {
		if (!user) {
			goto('/auth/login');
		} else {
			goto('/create-issue');
		}
	}

	function handleProfile(event) {
		if (!user) {
			goto('/auth/login');
		} else {
			goto('/profile');
		}
	}
</script>

<head>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
		rel="stylesheet"
	/>
</head>

<nav class="mobile-navbar d-md-none fixed-bottom">
	<a href="/" class="mobile-link">
		<i class="bi bi-house-door-fill fs-5"></i>
		<div class="label">Home</div>
	</a>
	<a href="/feed" class="mobile-link">
		<i class="bi bi-megaphone-fill fs-5"></i>
		<div class="label">Feed</div>
	</a>
	<a href="/create-issue" class="mobile-link" on:click|preventDefault={handleCreate}>
		<i class="bi bi-plus-circle-fill fs-5"></i>
		<div class="label">Create</div>
	</a>
	<a href="/about" class="mobile-link">
		<i class="bi bi-info-circle-fill fs-5"></i>
		<div class="label">About</div>
	</a>

	<a href="/profile" class="mobile-link" on:click|preventDefault={handleProfile}>
		{#if user}
			<img
				src={profilePic}
				alt="Profile"
				width="24"
				height="24"
				class="rounded-circle profile-img"
			/>
		{:else}
			<i class="bi bi-person-circle fs-5"></i>
		{/if}
		<div class="label">Profile</div>
	</a>
</nav>

<style>
	.mobile-navbar {
		background: var(--bg-light);
		color: var(--text);
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0.5rem 0;
		border-top: 1px solid var(--action-bg);
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1050;
		width: 100%;
	}

	.mobile-link {
		color: var(--text);
		text-decoration: none;
		text-align: center;
		font-size: 0.9em;
		transition: color 0.3s ease;
	}

	.mobile-link:hover {
		color: var(--primary);
	}

	.label {
		font-size: 12px;
		margin-top: 2px;
	}

	.profile-img {
		border: 2px solid var(--primary);
	}
</style>
