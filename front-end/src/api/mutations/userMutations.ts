import { useMutation } from "@tanstack/react-query";
import { ENDPOINTS } from "../endpoint";
import { request } from "../queries/baseQuery";
import { queryClient } from "../client";
import { postKeys } from "../queryKeys";

export const useSendComment = () => {
 return useMutation({
            mutationFn: ({postId,  value, parentId }: { postId: number; value: string; parentId: number | null }) =>
              request({
                url: ENDPOINTS.comment(postId),
                method: "POST",
                body: { parentId:  parentId, comment: value },
              }),
            onSuccess: (data, variables) => {
              console.log("댓글 작성 성공:", data);
                  queryClient.invalidateQueries({ queryKey: postKeys.comments(variables.postId) });

            },
        })
}
