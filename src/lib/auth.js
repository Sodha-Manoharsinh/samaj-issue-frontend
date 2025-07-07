import { writable } from 'svelte/store';
import api from '$lib/api';

export const token = writable(null);
export const user = writable(null);

// Load token from localStorage when app starts
if (typeof window !== 'undefined') {
	const stored = localStorage.getItem('auth_token');
	if (stored) {
		token.set(stored);
		fetchUser(stored);
	}
}

// Update localStorage + refetch user on token change
token.subscribe((value) => {
	if (typeof window === 'undefined') return;

	if (value) {
		localStorage.setItem('auth_token', value);
		fetchUser(value);
	} else {
		localStorage.removeItem('auth_token');
		user.set(null);
	}
});

// Fetch user info from /me endpoint
async function fetchUser(currentToken) {
	try {
		const res = await api.get('/me', {
			headers: {
				Authorization: `Bearer ${currentToken}`
			}
		});
		user.set(res.data);
	} catch (e) {
		console.error('Failed to fetch user:', e);
		user.set(null);
	}
}
