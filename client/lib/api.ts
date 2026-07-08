import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};


const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const getReviews = async () => {
  const res = await api.get("/reviews");
  return res.data;
};


export const createReview = async (code: string) => {
  const res = await api.post("/review", {
    code,
  });

  return res.data;
};


export const deleteReview = async (id: string) => {
  const res = await api.delete(`/reviews/${id}`);

  return res.data;
};


export const renameReview = async (
  id: string,
  title: string
) => {
  const res = await api.patch(`/reviews/${id}`, {
    title,
  });

  return res.data;
};
