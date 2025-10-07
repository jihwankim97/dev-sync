export const CommentGroup = (comments: any[]) => {
  const commentMap = new Map<number, any>();

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const rootComments: any[] = [];

  comments.forEach((comment) => {
    if (comment.parent) {
      const parentComment = commentMap.get(comment.parent);
      if (parentComment) {
        parentComment.replies.push(commentMap.get(comment.id));
      }
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  return rootComments;
};
