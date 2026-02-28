import axios from 'axios';

//Makes axios instance with the url
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
});

// Export axios instance
export default api;