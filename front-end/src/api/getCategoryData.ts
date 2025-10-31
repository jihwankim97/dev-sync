import { ENDPOINTS } from "./endpoint";

export const getCategoryData = async (category: string, page: number) => {
  const response = await fetch(
    `${ENDPOINTS.category()}/${category}?page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch category data");
  }
  const data = await response.json();

  return data;
};
