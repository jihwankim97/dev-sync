//api 호출시 공통 함수
export async function request<T>({
  method,
  body,
  url,
  responseType,
}: {
  method?: string;
  body?: T;
  url: string;
  responseType?: "json" | "text" | "boolean";
}) {
       console.log(url)

  const fetchOptions: RequestInit = {
    method: method,
    credentials: "include",
  };
  if (body instanceof FormData) {
    fetchOptions.body = body;
  } else if (body) {
    fetchOptions.body = JSON.stringify(body);
    fetchOptions.headers = { "Content-Type": "application/json" };
  }
     console.log(url)
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API 요청 실패");
  }

  if (url.includes("/auth/logout")) {
    console.log("Logged out");
    return true;
  }
  if (responseType === "text") {
    return response.text();
  }
  if (responseType === "boolean") {
    return true;
  }
  return response.json();
}
