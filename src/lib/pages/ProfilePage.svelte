<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import FeedPage from '$lib/feed/FeedPage.svelte';

	let user = null;
	let loading = true;
	let error = '';

	let editing = {
		name: false,
		password: false,
		picture: false
	};

	let newName = '';
	let newPassword = '';
	let newPicture = null;

	onMount(async () => {
		try {
			const res = await api.get('/me');
			user = res.data;
			newName = user.name;
			loading = false;
		} catch (err) {
			error = 'Failed to load profile';
			loading = false;
		}
	});

	async function updateProfile() {
		const formData = new FormData();
		formData.append('name', newName);
		if (newPassword) formData.append('password', newPassword);
		if (newPicture) formData.append('picture', newPicture);

		try {
			await api.put('/update-profile', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			location.reload();
		} catch (err) {
			error = err?.response?.data?.error || 'Failed to update';
		}
	}
</script>

{#if loading}
	<p class="text-center mt-5">Loading...</p>
{:else if error}
	<p class="text-danger text-center mt-5">{error}</p>
{:else}
	<div class="profile-container">
		<!-- 👤 Profile Section -->
		<section class="profile-page d-flex justify-content-center align-items-center">
			<div class="card profile-card shadow">
				<div class="card-body">
					<h2 class="text-center mb-4" style="color: var(--primary)">Your Profile</h2>

					<!-- Profile Picture -->
					<div class="position-relative mx-auto mb-4" style="width: 120px;">
						<img
							src={user.picture_url || '/default.png'}
							alt="Profile"
							class="rounded-circle img-fluid border"
							style="aspect-ratio: 1 / 1; object-fit: cover;"
							width="120"
							height="120"
						/>

						<!-- Edit Icon -->
						<button
							class="edit-pen btn btn-sm btn-light rounded-circle border"
							on:click={() => (editing.picture = true)}
							title="Edit Picture"
						>
							🖉
						</button>

						{#if editing.picture}
							<input
								type="file"
								class="form-control mt-2"
								on:change={(e) => (newPicture = e.target.files[0])}
							/>
						{/if}
					</div>

					<!-- Name -->
					<div class="mb-3">
						<label class="form-label" for="nameInput">Name</label>
						{#if editing.name}
							<input id="nameInput" class="form-control profile-input" bind:value={newName} />
						{:else}
							<div class="d-flex align-items-center">
								<span style="color: var(--text)">{user.name}</span>
								<button
									class="btn btn-sm btn-outline-primary ms-3"
									on:click={() => (editing.name = true)}
								>
									🖉
								</button>
							</div>
						{/if}
					</div>

					<!-- Email -->
					<div class="mb-3">
						<label class="form-label" for="emailDisplay">Email</label>
						<p id="emailDisplay" style="color: var(--text-muted)">{user.email}</p>
					</div>

					<!-- Password -->
					<div class="mb-3">
						<label class="form-label" for="passwordInput">Password</label>
						{#if editing.password}
							<input
								id="passwordInput"
								type="password"
								class="form-control profile-input"
								bind:value={newPassword}
							/>
						{:else}
							<div class="d-flex align-items-center">
								<span>••••••••</span>
								<button
									class="btn btn-sm btn-outline-primary ms-3"
									on:click={() => (editing.password = true)}
								>
									🖉
								</button>
							</div>
						{/if}
					</div>

					<!-- Save -->
					<button class="btn btn-success w-100 mt-3" on:click={updateProfile}>
						Save Changes
					</button>
				</div>
			</div>
		</section>

		<!-- 📋 My Issues Section -->
		<section class="my-issues-section container-fluid py-5 px-3 px-md-5">
			<h3 class="mb-4" style="color: var(--primary)">My Issues</h3>
			<FeedPage userId={user.id} />
		</section>
	</div>
{/if}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background: var(--bg-linear);
		overflow-y: auto;
		color: var(--text);
	}

	.profile-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.profile-page {
		min-height: 100vh;
		background: var(--bg-linear);
		padding: 2rem 1rem;
	}

	.profile-card {
		width: 100%;
		max-width: 500px;
		padding: 1.5rem;
		border-radius: var(--border-radius);
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		transition: var(--transition);
		color: var(--text);
	}

	.profile-input {
		background: var(--bg-light);
		color: var(--text);
		border: 1px solid var(--card-border);
	}

	.profile-input::placeholder {
		color: var(--text-muted);
	}

	.edit-pen {
		position: absolute;
		bottom: 5px;
		right: 5px;
		font-size: 0.9rem;
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.my-issues-section {
		background: var(--bg);
	}
</style>
