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
  comments: (postId: number) => ["comments", ...postKeys.post(postId)] as const,
  likeStatus: (postId: number) =>
    ["likeStatus", ...postKeys.post(postId)] as const,
  likeCount: (postId: number) =>
    ["likeCount", ...postKeys.post(postId)] as const,
  category: (category: string) => ["category", { category }] as const,
};
