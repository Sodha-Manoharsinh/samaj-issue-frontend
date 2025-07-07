<script>
	import { goto } from '$app/navigation';
	import api from '$lib/api';

	let email = '';
	let name = '';
	let password = '';
	let code = '';
	let step = 1;
	let picture;
	let message = '';

	function isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function containsInjection(value) {
		const pattern = /('|--|;|\/\*|\*\/|xp_|exec|union|select|drop|insert|delete|update)/i;
		return pattern.test(value);
	}

	async function sendOtp() {
		message = '';

		if (!isValidEmail(email)) {
			message = 'Invalid email format.';
			return;
		}

		if (containsInjection(email)) {
			message = 'Invalid characters in email.';
			return;
		}

		try {
			const res = await api.post('/signup', { email });
			message = res.data.message;
			step = 2;
		} catch (err) {
			message = err?.response?.data?.error || 'Failed to send OTP';
		}
	}

	async function verifyOtp() {
		message = '';

		if (!name || !password || !code) {
			message = 'Please fill in all required fields.';
			return;
		}

		if (containsInjection(name) || containsInjection(password)) {
			message = 'Invalid characters in input.';
			return;
		}

		try {
			const formData = new FormData();
			formData.append('email', email);
			formData.append('name', name);
			formData.append('password', password);
			formData.append('code', code);
			if (picture) formData.append('picture', picture);

			const res = await api.post('/verify-otp', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});

			message = res.data.message;
			goto('/auth/login');
		} catch (err) {
			message = err?.response?.data?.error || 'Verification failed';
		}
	}
</script>

<!-- Signup Card -->
<div
	class="d-flex justify-content-center align-items-center"
	style="height: 100vh; overflow:hidden; background:var(--bg-linear)"
>
	<div
		class="signup-card card shadow"
		style="background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow);"
	>
		<div class="card-body">
			<h2 class="text-center mb-4" style="color: var(--primary)">
				{step === 1 ? 'Sign Up' : 'Verify & Complete Signup'}
			</h2>

			<form
				on:submit|preventDefault={step === 1 ? sendOtp : verifyOtp}
				class="d-flex flex-column gap-3"
			>
				{#if step === 1}
					<input type="email" class="form-control" placeholder="Email" bind:value={email} />
					<button type="submit" class="btn btn-outline-primary">Send OTP</button>
				{:else}
					<input type="text" class="form-control" placeholder="Name" bind:value={name} />
					<input
						type="password"
						class="form-control"
						placeholder="Password"
						bind:value={password}
					/>
					<input type="text" class="form-control" placeholder="OTP Code" bind:value={code} />
					<input
						type="file"
						class="form-control"
						on:change={(e) => (picture = e.target.files[0])}
					/>
					<button type="submit" class="btn btn-outline-primary">Verify & Create Account</button>
				{/if}
			</form>

			{#if message}
				<p class="text-center mt-3" style="color: var(--text-muted)">{message}</p>
			{/if}

			<p class="text-center mt-4" style="color: var(--text-muted)">
				Already have an account?
				<a href="/auth/login" class="fw-bold text-decoration-none" style="color: var(--primary)">
					Log in
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

	.signup-card {
		width: 90vw;
		max-width: 420px;
		margin: 2rem auto;
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
