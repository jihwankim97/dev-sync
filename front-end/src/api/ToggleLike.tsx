export const ToggleLike = async (postId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/post/${postId}/like-toggle
`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("좋아요 토글 클릭 실패");
    }
  } catch (error) {
    return null;
  }
};
