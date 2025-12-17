import { queryOptions } from "@tanstack/react-query";
import { request } from "./baseQuery";
import { userKeys } from "../queryKeys";
import { ENDPOINTS } from "../endpoint";

export function loginStateOption() {
    return queryOptions(
        {
            queryKey: userKeys.auth("login"),
            queryFn: () =>
              request({
                method: "GET",
                url: ENDPOINTS.auth("status"),
                responseType: "text",
              }),
          }
    )
}  

export function userDataOption(){ 
    return queryOptions(
        {
            queryKey: userKeys.user,
            queryFn: () => request({ url: ENDPOINTS.user() }),
        }
    )
}