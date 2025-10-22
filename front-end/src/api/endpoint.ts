const BASE_URL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;
console.log("BASE_URL:", BASE_URL);
export const ENDPOINTS = {
  post: (postId: string) => `${BASE_URL}/${postId}`,
  comment: (postId: number | string) => `${BASE_URL}/post/comment/${postId}`,
  resume: (resumeId: number) => `${BASE_URL}/${resumeId}`,
  user: () => `${BASE_URL}/user`,
  userId: (userId: string) => `${BASE_URL}/user/${userId}`,
  base: () => `${BASE_URL}`,
  auth: (state: string) => `${BASE_URL}/auth/${state}`,
};
