import type { userInfo } from "../types/resume.type";

export async function fetchUserInfo(): Promise<userInfo> {
  const response = await fetch("http://localhost:3000/user", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
}
