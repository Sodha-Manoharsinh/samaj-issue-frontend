<script>
	import { goto } from '$app/navigation';
	import api from '$lib/api';
	import { token } from '$lib/auth';

	let email = '';
	let password = '';
	let message = '';

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function containsInjection(value) {
		const pattern = /('|--|;|\/\*|\*\/|xp_|exec|union|select|drop|insert|delete|update)/i;
		return pattern.test(value);
	}

	async function loginUser() {
		message = '';

		if (!isValidEmail(email)) {
			message = 'Please enter a valid email address.';
			return;
		}

		if (containsInjection(email) || containsInjection(password)) {
			message = 'Invalid characters detected.';
			return;
		}

		try {
			const res = await api.post('/login', { email, password });

			const { token: jwt } = res.data;

			localStorage.setItem('token', jwt);
			token.set(jwt);
			message = res.message;
			goto('/');
		} catch (err) {
			message = err?.response?.data?.error || 'Login failed';
		}
	}
</script>

<!-- Login Card -->
<div
	class="d-flex justify-content-center align-items-center"
	style="height: 100vh; overflow: hidden; background: var(--bg-linear);"
>
	<div
		class="login-card card shadow"
		style="background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow);"
	>
		<div class="card-body">
			<h2 class="text-center mb-4" style="color: var(--primary)">Log In</h2>

			<form on:submit|preventDefault={loginUser} class="d-flex flex-column gap-3">
				<input type="email" class="form-control" placeholder="Email" bind:value={email} />
				<input type="password" class="form-control" placeholder="Password" bind:value={password} />
				<button type="submit" class="btn btn-outline-primary">Log In</button>
			</form>

			{#if message}
				<p class="text-center mt-3" style="color: var(--text-muted)">{message}</p>
			{/if}

			<p class="text-center mt-4" style="color: var(--text-muted)">
				Don't have an account?
				<a href="/auth/signup" class="fw-bold text-decoration-none" style="color: var(--primary)">
					Sign up
				</a>
			</p>
		</div>
	</div>
</div>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
		background: var(--bg-linear);
		overflow: hidden;
	}

	.login-card {
		width: 90vw;
		max-width: 420px;
		border-radius: var(--border-radius);
		transition: var(--transition);
	}

	/* Optional padding for better mobile spacing */
	@media (max-width: 576px) {
		.card-body {
			padding: 1.5rem;
		}
	}
</style>
