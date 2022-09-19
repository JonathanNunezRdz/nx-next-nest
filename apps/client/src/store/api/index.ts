import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333';

const api = axios.create({
	baseURL: `${BASE_URL}/api`,
});

export default api;
