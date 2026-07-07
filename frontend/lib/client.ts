import axios from "axios";
import { removeSessionUser, removeToken } from "./auth";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      removeToken();
      removeSessionUser();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default client;
