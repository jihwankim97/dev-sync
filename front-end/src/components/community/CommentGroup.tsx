import type { Comment } from "../../types/feed.type";

export type CommentGroup = Comment & {
  replies: CommentGroup[];
  comment_id?: string;
};

export const CommentGroup = (comments: Comment[]) => {
  const commentMap = new Map<number, CommentGroup>();

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });
  const rootComments: CommentGroup[] = [];

  comments?.forEach((comment) => {
    if (comment.parent) {
      const parentComment = commentMap.get(comment.parent);
      if (parentComment) {
        parentComment.replies.push(commentMap.get(comment.id)!);
      }
    } else {
      rootComments.push(commentMap.get(comment.id)!);
    }
  });

  return rootComments;
};
