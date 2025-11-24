import axios from "axios";

export const createApiClient = (token = null) => {
  const instance = axios.create({
    baseURL: "https://sophia4293.pythonanywhere.com",
    withCredentials: true, // for cookies (device_id)
    headers: {
      // "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // optional: refresh token interceptor or error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // can handle token expiry or global errors here
      return Promise.reject(error.response?.data || error);
    }
  );

  return instance;
};


