import axios from "axios";

const axiosInst = axios.create({
  baseURL: import.meta.env.PROD ? "https://forever-backend-1i7v.onrender.com/api" : "http://localhost:3000/api",
  withCredentials: true,
  timeout: 5000
});

export default axiosInst;
