import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
});

// Signup
export const signupUser = (formData) => API.post('/users/signup', formData);

// Login
export const loginUser = (formData) => API.post('/users/login', formData);
