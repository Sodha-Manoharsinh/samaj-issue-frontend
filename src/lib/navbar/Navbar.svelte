<script>
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import { token } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	let currentPath = '';
	let user = null;
	let profilePic = '/default.png';

	onMount(async () => {
		currentPath = window.location.pathname;

		const jwt = get(token) || localStorage.getItem('token');
		if (jwt) {
			try {
				const res = await api.get('/me', {
					headers: { Authorization: `Bearer ${jwt}` }
				});
				user = res.data;
				profilePic = user?.picture_url || '/default.png';
			} catch (err) {
				console.warn('Token invalid or expired');
				token.set(null);
				localStorage.removeItem('token');
			}
		}

		await import('bootstrap/dist/js/bootstrap.bundle.min.js');

		const isDark = document.documentElement.classList.contains('dark-theme');
		const themeIcon = document.getElementById('theme-icon');
		if (themeIcon) {
			themeIcon.src = isDark ? '/icons/sun.svg' : '/icons/moon.svg';
		}
	});

	const toggleTheme = () => {
		const root = document.documentElement;
		root.classList.toggle('dark-theme');

		const themeIcon = document.getElementById('theme-icon');
		if (themeIcon) {
			themeIcon.src = root.classList.contains('dark-theme') ? '/icons/sun.svg' : '/icons/moon.svg';
		}
	};

	function logout() {
		localStorage.removeItem('token');
		token.set(null);
		user = null;
		goto('/');
	}
</script>

<nav class="navbar navbar-expand-lg shadow py-3 fixed-top" style="background: var(--bg-light);">
	<div class="container-fluid mx-5">
		<!-- Logo -->
		<a class="navbar-brand d-flex align-items-center gap-2" href="/">
			<img src="/favicon.svg" alt="Logo" class="logo-img" />
			<span class="fw-bold logo-text">
				<span style="color: var(--primary);">S</span>amaj
				<span style="color: var(--primary);">I</span>ssue
			</span>
		</a>

		<!-- Mobile Toggler -->
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>

		<!-- Nav links -->
		<div class="collapse navbar-collapse justify-content-end" id="navbarNav">
			<ul class="navbar-nav gap-3 fw-semibold align-items-center w-100 justify-content-end">
				<!-- Theme toggle - always show -->
				<li class="nav-item">
					<button class="theme-toggle-icon btn p-0 border-0 bg-transparent" on:click={toggleTheme}>
						<img id="theme-icon" src="/icons/moon.svg" alt="Toggle Theme" width="26" height="26" />
					</button>
				</li>

				<!-- Desktop-only links -->
				<li class="nav-item d-none d-lg-block">
					<a class="nav-link lp-nav {currentPath === '/' ? 'active' : ''}" href="/">Home</a>
				</li>
				<li class="nav-item d-none d-lg-block">
					<a class="nav-link lp-nav {currentPath === '/feed' ? 'active' : ''}" href="/feed">Feed</a>
				</li>
				<li class="nav-item d-none d-lg-block">
					<a
						class="nav-link lp-nav {currentPath === '/create-issue' ? 'active' : ''}"
						href="/create-issue">Create Issue</a
					>
				</li>
				<li class="nav-item">
					<a class="nav-link lp-nav {currentPath === '/about' ? 'active' : ''}" href="/about"
						>About</a
					>
				</li>

				{#if user}
					<!-- Logout - visible on all views -->
					{#if user.role == 'admin'}
						<li class="nav-item">
							<a
								class="nav-link lp-nav {currentPath === '/auth/admin' ? 'active' : ''}"
								href="/admin">Admin</a
							>
						</li>
					{/if}
					<li class="nav-item">
						<button class="nav-link btn lp-nav" on:click={logout}>Logout</button>
					</li>
				{:else}
					<!-- Login/Signup - visible on all views -->
					<li class="nav-item">
						<a
							class="nav-link lp-nav {currentPath === '/auth/login' ? 'active' : ''}"
							href="/auth/login">Log In</a
						>
					</li>
					<li class="nav-item">
						<a
							class="nav-link lp-nav {currentPath === '/auth/signup' ? 'active' : ''}"
							href="/auth/signup">Sign Up</a
						>
					</li>
				{/if}

				<!-- Profile picture (desktop only) -->
				{#if user}
					<a href="/profile" class="ms-3 d-none d-lg-block">
						<img
							src={profilePic}
							alt="Profile"
							width="40"
							height="40"
							class="rounded-circle border border-primary shadow-sm"
						/>
					</a>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<style>
	.lp-nav {
		color: var(--text-muted);
		font-size: 1.2em;
		position: relative;
		transition: var(--transition);
		background: transparent;
		border: none;
	}

	.logo-img {
		width: 30px;
		height: 30px;
	}

	.logo-text {
		color: var(--text);
		font-size: 1.4rem;
	}

	@media (min-width: 768px) {
		.logo-img {
			width: 40px;
			height: 40px;
		}

		.logo-text {
			font-size: 1.5rem;
		}
	}

	.lp-nav::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 0%;
		height: 2px;
		background-color: var(--primary);
		transition: width 0.4s ease-in-out;
	}

	.lp-nav:hover::after {
		width: 100%;
	}

	.lp-nav:hover {
		color: var(--text);
		transform: translateY(-1.5px);
	}

	.lp-nav.active {
		color: var(--text);
	}

	.lp-nav.active::after {
		width: 100%;
	}

	/* Fix dark theme toggler visibility */
	.navbar-toggler {
		filter: invert(0);
	}

	.theme-toggle-icon img {
		transition: transform 0.3s ease;
	}

	.theme-toggle-icon:hover img {
		transform: rotate(15deg) scale(1.1);
	}

	:global(.dark-theme) .navbar-toggler {
		filter: invert(1);
	}
</style>
