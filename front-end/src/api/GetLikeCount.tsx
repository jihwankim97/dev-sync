export const GetLikeCount = async (postId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/post/${postId}/likes/count`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("좋아요 개수 가져오기 실패");
    }

    const count = await response.json();
    return count;
  } catch (error) {
    return null;
  }
};
