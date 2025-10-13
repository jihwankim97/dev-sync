export const resumeKeys = {
  lists: ["lists"] as const,
  resume: (filter?: string) => [...resumeKeys.lists, { filter }] as const,
};

export const userKeys = {
  user: ["user"] as const,
};
