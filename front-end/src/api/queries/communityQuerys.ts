import { queryOptions } from "@tanstack/react-query";
import { ENDPOINTS } from "../endpoint";
import { postKeys } from "../queryKeys";
import { request } from "./baseQuery";


export const GetCommentsOption= (postId: string, page: number) => {
    return queryOptions({
    queryKey: postKeys.comments(Number(postId)),
    queryFn: () => {
      const link: string = `${postId}?page=${page}`;
      return request({ url: ENDPOINTS.comment(link) });
    },
  })
}
