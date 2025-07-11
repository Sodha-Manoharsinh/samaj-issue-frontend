import axios from 'axios';

// const BaseURL = 'https://web-production-11ec2.up.railway.app/api';
const BaseURL = 'https://samaj-issue-backend.onrender.com/api';

const api = axios.create({
	baseURL: BaseURL,
	withCredentials: true
});

// Optional: Add auth header interceptor
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
