export const EditComment = async (comment: string, commentId: number) => {
  console.log(comment, commentId);
  try {
    const response = await fetch(
      `http://localhost:3000/post/comment/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          comment: comment,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "글 편집에 실패 했어요.");
    }
  } catch (error) {
    console.error(error);
  }
};
