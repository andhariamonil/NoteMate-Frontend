import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000", // Change if your backend is on a different port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
