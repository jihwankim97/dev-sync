import { queryOptions } from "@tanstack/react-query";
import { ENDPOINTS } from "../endpoint";
import { postKeys } from "../queryKeys";
import { request } from "./baseQuery";
import { getCategoryData } from "../getCategoryData";

export const GetCommentsOption = (postId: string, page: number) => {
  return queryOptions({
    queryKey: postKeys.comments(Number(postId)),
    queryFn: () => {
      const link: string = `${postId}?page=${page}`;
      return request({ url: ENDPOINTS.comment(link) });
    },
  });
};

export const GetCategoryDataOption = (category: string) => {
  return queryOptions({
    queryKey: postKeys.category(category),
    queryFn: () => getCategoryData(category),
    enabled: !!category,
  });
};
