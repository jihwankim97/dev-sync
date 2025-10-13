//api 호출시 공통 함수

export async function request<T>({
  method,
  body,
  url,
}: {
  method: string;
  body?: T;
  url: string;
}) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API 요청 실패");
  }

  return response.json();
}
