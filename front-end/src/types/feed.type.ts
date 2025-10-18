export type Comment = {
  author: number;
  comment: string;
  createdAt: string;
  id: number;
  parent: number;
  profile_image: string;
  user_name: string;
};

export type CommentList = {
  totalCount: number;
  comments: Comment[];
};
