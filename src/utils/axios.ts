import axios from "axios";
import Cookies from "js-cookie";

export const apiInstance = axios.create({

  baseURL: process.env.API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(function (config) {
  const token = Cookies.get("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export const fetcher = (url) => apiInstance.get(url).then((res) => res.data);
