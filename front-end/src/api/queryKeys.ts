export const resumeKeys = {
  lists: ["lists"] as const,
  resume: (filter?: string) => [...resumeKeys.lists, { filter }] as const,
};

export const userKeys = {
  user: ["user"] as const,
  auth: (state: string) => [...userKeys.user, { state }] as const,
};

export const postKeys = {
  lists: ["posts"] as const,
  post: (postId: number) => [...postKeys.lists, { postId }] as const,
  comments: (postId: number, page: number) =>
    ["comments", ...postKeys.post(postId), page] as const,
  likeStatus: (postId: number) =>
    ["likeStatus", ...postKeys.post(postId)] as const,
  likeCount: (postId: number) =>
    ["likeCount", ...postKeys.post(postId)] as const,
  categorySearch: (
    category: string,
    search: { keyword: string; type: string },
    page: number
  ) =>
    [
      "category",
      { category, keyword: search.keyword, type: search.type, page },
    ] as const,
};
