import axios from "axios";

const api = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}/api`,
    withCredentials:true, // sends the refreshToken cookie automatically with every request
});

export default api;
