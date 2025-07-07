// src/lib/api.js

import axios from 'axios';

const api = axios.create({
	baseURL: 'https://samaj-issue-backend.onrender.com/api' // 🔁 replace this
});

// Add Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
