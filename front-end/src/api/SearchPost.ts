export const searchPost = async ({
  search,
  category,
}: {
  search: { keyword: string; type: string };
  category: "자유게시판" | "질문게시판" | "공지사항";
}) => {
  const response = await fetch(
    `http://localhost:3000/post/search?keyword=${encodeURIComponent(
      search.keyword
    )}&category=${encodeURIComponent(category)}&type=${search.type}`
  );

  if (!response.ok) {
    console.error("검색 실패");
    return;
  }

  const result = await response.json();
  console.log(result);
  return result;
};
