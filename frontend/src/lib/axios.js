import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://localhost:6969/api/v1", // backend url for fetch
    withCredentials: true // handle cookies
})