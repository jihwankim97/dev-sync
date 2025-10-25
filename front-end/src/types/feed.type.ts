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

export type PostType = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentcount: number;
  likecount: number;
};
