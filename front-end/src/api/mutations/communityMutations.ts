import { useMutation } from "@tanstack/react-query";
import { request } from "../queries/baseQuery";
import { ENDPOINTS } from "../endpoint";
import { queryClient } from "../client";
import { postKeys } from "../queryKeys";

export const useSendComment = (postId: number) => {
 return useMutation({
            mutationFn: (value: string) =>
              request({
                url: ENDPOINTS.comment(postId),
                method: "POST",
                body: { parentId: null, comment: value },
              }),
            onSuccess: (data) => {
              console.log("댓글 작성 성공:", data);
              queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });

            },
        })
}

export const useEditComment = (commentId: number, postId: number) => {
    return useMutation({
        mutationFn: (comment: string) =>
            request({
                url: ENDPOINTS.comment(String(commentId)),
                method: "PATCH",
                body: { comment }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.comments (postId) });
        }
    });
};

export const useRemoveComment = (commentId: number ,postId: number) => {
    return useMutation({
        mutationFn: () =>
            request({
                url: ENDPOINTS.comment(String(commentId)),
                method: "DELETE"
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
        }
    });
};