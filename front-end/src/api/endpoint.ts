const BASE_URL = import.meta.env.BASE_URL;
export const ENDPOINTS = 
{
   post : (postId : number) => `${BASE_URL}/${postId}`,
   resume : (resumeId :number) =>`${BASE_URL}/${resumeId}`,
   user : (userId : number) => `${BASE_URL}/${userId}`,
   base : () => `${BASE_URL}`
}