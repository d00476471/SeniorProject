import axios from 'axios';

//Makes axios instance with the url
const api = axios.create({
    baseURL: "http://localhost:8000"
});

// Export axios instance
export default api;