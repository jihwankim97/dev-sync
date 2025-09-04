export const GetExistResume = async (postId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/resumes/${postId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("좋아요 개수 가져오기 실패");
    }

    const count = await response.json();
    return count;
  } catch (error) {
    console.error(error);
    return null;
  }
};
