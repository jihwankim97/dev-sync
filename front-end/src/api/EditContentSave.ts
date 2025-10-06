export const EditContentSave = async ({
  title,
  content,
  postId,
  category,
}: {
  title: string;
  content: string;
  postId: number;
  category: string;
}) => {
  console.log(title, content, category, postId);
  try {
    const response = await fetch(`http://localhost:3000/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 데이터를 전송
      },
      credentials: "include", // CORS 및 쿠키를 포함하려면 'include'로 설정
      body: JSON.stringify({
        title: title,
        content: content,
        category: category,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "글 편집에 실패 했어요.");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
