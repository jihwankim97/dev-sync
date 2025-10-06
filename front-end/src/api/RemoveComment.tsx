export const RemoveComment = async (commentId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/post/comment/${commentId}`,
      {
        method: "DELETE",
        credentials: "include", // 인증된 요청을 위해 쿠키 포함
      }
    );

    if (!response.ok) throw new Error("삭제 실패");

    console.log("댓글 삭제 성공");
  } catch (error) {
    console.error(error);
  }
};
