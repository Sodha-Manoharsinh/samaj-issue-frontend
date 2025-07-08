import axios from 'axios';

const railwayURL = 'https://web-production-11ec2.up.railway.app/api';
const renderURL = 'https://samaj-issue-backend.onrender.com/api';

const api = axios.create({
	withCredentials: true // baseURL will be set dynamically
});

let setupPromise = null;

// Only runs once — sets baseURL dynamically
function setupBaseURL() {
	if (setupPromise) return setupPromise;

	setupPromise = axios
		.get(`${railwayURL}/ping`)
		.then(() => {
			api.defaults.baseURL = railwayURL;
		})
		.catch(() => {
			api.defaults.baseURL = renderURL;
		});

	return setupPromise;
}

// Optional: Add auth header interceptor
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

await setupBaseURL(); // ⬅️ One-time setup before export

export default api;
