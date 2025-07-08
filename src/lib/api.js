import axios from 'axios';

const railwayURL = 'https://web-production-11ec2.up.railway.app/api';
const renderURL = 'https://samaj-issue-backend.onrender.com/api';

const api = axios.create();

// Set baseURL dynamically
(async () => {
	try {
		await axios.get(`${railwayURL}/ping`);
		api.defaults.baseURL = railwayURL;
	} catch {
		api.defaults.baseURL = renderURL;
	}
})();

// Add Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
