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
  comments: (postId: number) => [...postKeys.post(postId), "comments"] as const,
}
