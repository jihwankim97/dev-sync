export const GetCommentList = async (
  page: number,
  postId: number,
  setComments: any,
  setTotalPages: any
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/post/comment/${postId}?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("댓글 불러오기 실패");

    const data = await response.json();

    const updatedComments = data.comments.map((comment: any) => ({
      ...comment,
      isDeleted: false,
    }));
    setComments(updatedComments);

    // setComments(data.comments);
    setTotalPages(data.totalCount);
  } catch (error) {
    console.error(error);
  }
};
