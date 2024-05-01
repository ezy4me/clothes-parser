import axios from "axios";

const commonConfig = {
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: false,
};

const apiInstance = axios.create({
  ...commonConfig,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(async (config) => {
  return config;
});

export { apiInstance };
