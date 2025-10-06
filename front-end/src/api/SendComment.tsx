export const SendComment = async (
  value: any,
  parent: number | null,
  userId: number,
  postId: number
) => {
  try {
    console.log({
      postId: postId,
      parentId: parent,
      comment: value,
    });
    const response = await fetch(
      `http://localhost:3000/post/comment/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          parentId: parent,
          comment: value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("댓글실패");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
