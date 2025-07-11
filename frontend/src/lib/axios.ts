import axios from "axios";

const axiosInst = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://forever-backend-1i7v.onrender.com/api"
    : "http://localhost:5000/api",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosInst;