import type { PostType } from "../types/feed.type";
import { ENDPOINTS } from "./endpoint";

export const getCategoryData = async (category: string) => {
  const response = await fetch(`${ENDPOINTS.category()}/${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch category data");
  }
  const data: PostType[] = await response.json();
  const cleanedData = data
    .map((post: PostType) => ({
      ...post,
      content: post.content,
    }))
    .sort((a, b) => b.id - a.id);

  return cleanedData;
};
