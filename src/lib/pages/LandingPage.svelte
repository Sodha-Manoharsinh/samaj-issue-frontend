<script>
	import { onMount } from 'svelte';

	const handleGetStarted = () => {
		window.location.href = '/auth/signup';
	};

	const features = [
		{
			title: 'Report Issues',
			description: 'Easily submit local issues with descriptions, images, and location.',
			src: 'report-issue.png'
		},
		{
			title: 'Live Feed & Status',
			description:
				'View all reported issues with real-time status updates: Open, In Progress, or Solved.',
			src: 'check-list.png'
		},
		{
			title: 'AI Summaries',
			description: 'Get concise, AI-generated summaries of discussions and updates on issues.',
			src: 'ai-assistant.png'
		},
		{
			title: 'Upvotes',
			description: 'Upvote issues that matter to you and help highlight urgent concerns.',
			src: 'message.png'
		},
		{
			title: 'Admin Panel',
			description: 'Admins can manage issues, update statuses, and access platform statistics.',
			src: 'admin.png'
		},
		{
			title: 'Dark/Light Mode',
			description: 'Switch between dark and light themes for a comfortable browsing experience.',
			src: 'display-modes.png'
		}
	];

	const testimonial_msgs = [
		{
			msg: 'Fixed our street light in 3 days!',
			name: 'Jim',
			src: 'user1.jpeg'
		},
		{
			msg: 'Great platform to voice problems.',
			name: 'Stanley',
			src: 'user2.jpeg'
		},
		{
			msg: 'Dark mode and instant upvotes are amazing.',
			name: 'Dwight',
			src: 'user3.jpeg'
		}
	];

	const howItWorks = [
		{
			title: '1. Sign Up',
			description: 'Quick OTP-based signup for secure access.',
			src: 'signup.png'
		},
		{
			title: '2. Raise an Issue',
			description: 'Describe the problem, upload an image, and submit.',
			src: 'issue.png'
		},
		{
			title: '3. Track Progress',
			description: 'Check status, upvote, or comment as updates happen.',
			src: 'track.png'
		}
	];
</script>

<main class="snap-wrapper">
	<!-- Hero -->
	<section class="hero section">
		<div
			class="container row align-items-center justify-content-between flex-column flex-md-row text-center text-md-start"
		>
			<!-- Text Content -->
			<div class="col-md-6 order-2 order-md-1 px-4 py-5">
				<h2 class="fw-bold" style="color: var(--text)">
					Raise Local Problems,<br />Get Them Solved
				</h2>
				<p class="mt-3" style="color: var(--text-muted)">
					<strong>Samaj Issue</strong> lets you report potholes, broken lights, water issues, and more
					— all in one place.
				</p>
				<button class="btn btn-large mt-4" on:click={handleGetStarted}>Get Started</button>
			</div>

			<!-- Image -->
			<div class="col-md-6 order-1 order-md-2 text-center px-3 mb-4 mb-md-0">
				<img src="/imgs/landingpage.jpeg" alt="Samaj Issue" class="img-fluid w-100 hero-img" />
			</div>
		</div>

		<div class="scroll-down"><span>&darr;</span></div>
	</section>

	<!-- Features -->
	<section class="features section">
		<div class="container py-5">
			<h1 class="main-title fw-bold text-center mb-5">Platform Features</h1>
			<div class="row g-4">
				{#each features as feature}
					<div class="col-lg-4 col-md-6">
						<div class="card feature-card h-100">
							<div class="card-body">
								<div class="d-flex align-items-center gap-2 mb-2">
									<img src="/feature-icons/{feature.src}" alt="icon" class="feature-icon" />
									<h2 class="card-title h4 fw-semibold m-0">{feature.title}</h2>
								</div>
								<p class="card-text feature-description">{feature.description}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How it Works -->
	<section class="how-it-works section">
		<div class="container text-center">
			<h1 class="main-title fw-bold text-center mb-5" style="color: var(--primary)">
				How It Works
			</h1>
			<div class="row">
				{#each howItWorks as item}
					<div class="col-md-4 mb-4">
						<div class="how-card h-100 text-start">
							<img src={`/imgs/${item.src}`} alt={item.title} class="how-image mb-3" />
							<div class="how-content">
								<h5 class="how-title">{item.title}</h5>
								<p class="how-description">{item.description}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="testimonials section">
		<div class="container text-center">
			<h1 class="main-title fw-bold text-center mb-5" style="color: var(--primary)">
				What Users Say
			</h1>
			<div class="row">
				{#each testimonial_msgs as item}
					<div class="col-md-4 col-sm-6 mb-4">
						<div
							class="testimonial-card p-4 h-100 d-flex flex-column justify-content-between text-start"
						>
							<div class="testimonial-img-wrapper mb-3">
								<img src={`/imgs/${item.src}`} alt="user" class="testimonial-img" />
							</div>
							<p class="testimonial-message">"{item.msg}"</p>
							<p class="text-end testimonial-author mt-3">– {item.name}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta section text-center">
		<div class="container">
			<h1 class="fw-bold" style="color: var(--primary)">Ready to Make a Difference?</h1>
			<h5 style="color: var(--text-muted)">Join the community and start raising issues today.</h5>
			<button class="btn btn-large mt-3" on:click={handleGetStarted}>Get Started Now</button>
		</div>
	</section>
</main>

<style>
	.snap-wrapper {
		scroll-snap-type: y mandatory;
		overflow-y: scroll;
		height: 92vh;
		scroll-behavior: smooth;
	}

	.section {
		scroll-snap-align: start;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 1rem;
		background: var(--bg-linear);
		transition: var(--transition);
	}

	.hero-img {
		border-radius: var(--border-radius);
		max-width: 60%;
		height: auto;
		object-fit: cover;
		box-shadow: var(--card-shadow);
	}

	.btn-large {
		font-size: 1.1rem;
		padding: 0.75rem 1.5rem;
		border-radius: var(--border-radius);
		font-weight: bold;
		border: none;
		margin: 0 0.5rem;
		background: var(--primary);
		color: white;
		transition: var(--transition);
	}

	.main-title {
		color: var(--primary);
	}

	.feature-description {
		color: var(--card-description);
	}

	.feature-icon {
		width: 27px;
		height: 27px;
		margin-right: 0.5rem;
		object-fit: contain;
	}

	.feature-card {
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		border-radius: 1rem;
		transition: transform 0.3s ease;
	}

	.card-title {
		color: var(--card-title);
	}

	.feature-card:hover {
		transform: translateY(-5px);
	}

	.testimonial-card {
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		border-radius: var(--border-radius);
		transition: transform 0.3s ease;
	}

	.testimonial-card:hover {
		transform: translateY(-5px);
	}

	.testimonial-img-wrapper {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.testimonial-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 50%;
		border: 2px solid var(--primary);
	}

	.testimonial-message {
		color: var(--card-description);
		font-size: 18px;
		font-style: italic;
	}

	.testimonial-author {
		color: var(--card-title);
		font-weight: 500;
	}
	.how-card {
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		border-radius: var(--border-radius);
		padding: 1rem;
		transition: transform 0.3s ease;
	}

	.how-card:hover {
		transform: translateY(-5px);
	}

	.how-image {
		width: 100%;
		max-height: 350px;
		object-fit: contain;
		border-radius: var(--border-radius);
		margin-bottom: 2rem;
		background-color: var(--bg-light);
	}

	.how-title {
		color: var(--card-title);
		font-weight: 600;
		margin-bottom: 0.5rem;
		margin-left: 1rem;
	}

	.how-description {
		color: var(--card-description);
		margin-left: 1rem;
	}

	.scroll-down {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 2rem;
		color: var(--primary);
		padding: 0px 20px;
		border: 2px solid var(--primary);
		border-radius: 70%;
		box-shadow: 0px 0px 8px var(--primary);
		animation: bounce 1.5s infinite;
		z-index: 1;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-10px);
		}
	}

	@media (max-width: 768px) {
		.hero-img {
			max-height: 300px;
			margin-top: 1rem;
		}
		.testimonial-img-wrapper {
			margin: 0 auto 1rem auto;
		}
		.testimonial-card {
			text-align: center;
		}
		.testimonial-author {
			text-align: center !important;
		}
		.scroll-down {
			bottom: 60px;
		}
	}
</style>
