<script>
	const team = [
		{
			name: 'Sodha Manoharsinh Chandubha',
			roles: [
				{ role: 'Frontend', border: 'red' },
				{ role: 'Backend', border: 'blue' },
				{ role: 'Database', border: 'green' },
				{ role: 'API Testing', border: 'gold' },
				{ role: 'Deployment', border: 'purple' }
			],
			instagram: 'manoharsinhsodha',
			linked_in: 'manoharsinh-sodha',
			github: 'Sodha-Manoharsinh',
			img: '/imgs/mannu.jpeg'
		},
		{
			name: 'Todarmal Saumya',
			roles: [
				{ role: 'Figma Design', border: 'orange' },
				{ role: 'Frontend', border: 'deepskyblue' },
				{ role: 'Frontend Testing', border: 'limegreen' },
				{ role: 'Documentation', border: 'hotpink' },
				{ role: 'Miro Board Design', border: 'cyan' }
			],
			instagram: 'kripler_01',
			linked_in: null,
			github: 'SnugBacon56',
			img: '/imgs/sommu.jpeg'
		}
	];
</script>

<section class="about-section">
	<h1>About Samaj Issue</h1>
	<p class="intro">
		<strong>Samaj Issue</strong> is a collaborative platform created to empower local citizens to report,
		discuss, and resolve community problems transparently with administrative support.
	</p>

	<h2 class="subheading">Meet the Team</h2>
	<div class="team-container">
		{#each team as member}
			<div class="card">
				<img class="member-img" src={member.img} alt={member.name} />
				<h3 class="member-name">{member.name}</h3>
				<div class="roles-container">
					{#if member.roles}
						{#each member.roles as r}
							<span
								class="role-pill"
								style="border-color: {r.border}; box-shadow: 0 0 8px {r.border};"
							>
								{r.role}
							</span>
						{/each}
					{/if}
				</div>
				<div class="social-links">
					{#if member.instagram}
						<a
							href={`https://instagram.com/${member.instagram}`}
							target="_blank"
							rel="noopener noreferrer"
							title="Instagram"
						>
							<img src="/icons/instagram.png" alt="Instagram" class="icon" />
						</a>
					{/if}
					{#if member.github}
						<a
							href={`https://github.com/${member.github}`}
							target="_blank"
							rel="noopener noreferrer"
							title="GitHub"
						>
							<img src="/icons/github.png" alt="GitHub" class="icon" />
						</a>
					{/if}
					{#if member.linked_in}
						<a
							href={`https://linkedin.com/in/${member.linked_in}`}
							target="_blank"
							rel="noopener noreferrer"
							title="LinkedIn"
						>
							<img src="/icons/linkedin.png" alt="LinkedIn" class="icon" />
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<footer class="footer">With ❤️ from the Samaj Issue Team</footer>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

	.about-section {
		padding: 3rem 2rem;
		background: var(--bg-linear);
		min-height: 100vh;
		color: var(--text);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		color: var(--card-title);
		margin-bottom: 1rem;
	}

	.intro {
		max-width: 700px;
		font-size: 1.1rem;
		color: var(--text-muted);
		margin-bottom: 3rem;
		line-height: 1.6;
	}

	.subheading {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		color: var(--card-title);
	}

	.team-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
		width: 100%;
		max-width: 1000px;
		margin-bottom: 2rem;
	}

	.card {
		background: var(--card-bg);
		border: var(--card-border);
		box-shadow: var(--card-shadow);
		padding: 1.5rem;
		border-radius: var(--border-radius);
		transition: var(--transition);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.card:hover {
		transform: translateY(-0.7rem);
	}

	.member-img {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 50%;
		border: 3px solid var(--primary);
		margin-bottom: 1rem;
		transition: all 0.7s ease-in-out;
	}

	.member-img:hover {
		transform: scale(1.3);
	}

	.member-name {
		color: var(--card-title);
		font-size: 1.15rem;
		margin-bottom: 0.3rem;
		text-align: center;
	}

	.roles-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		margin-top: 1rem;
	}

	.role-pill {
		padding: 0.35rem 0.7rem;
		font-size: 0.85rem;
		font-weight: 600;
		border: 2px solid;
		border-radius: 9999px;
		color: var(--text);
		background-color: var(--card-bg);
		transition: transform 0.3s ease;
	}

	.role-pill:hover {
		transform: scale(1.1);
	}

	.social-links {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.icon {
		width: 22px;
		height: 22px;
		transition: transform 0.3s ease;
		margin-right: 0.5rem;
	}

	.icon:hover {
		transform: scale(1.25);
	}

	.footer {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin-top: 3rem;
	}
</style>
