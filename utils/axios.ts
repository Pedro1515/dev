import axios from "axios";
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(function (config) {
  const token = Cookies.get("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export const fetcher = (url) => apiInstance.get(url).then((res) => res.data);
