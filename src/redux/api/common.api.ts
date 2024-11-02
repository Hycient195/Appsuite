import {  BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import GLOBAL_BASEURL from "./_globalBaseURL";
import { ICreateFileRequest, IUpdateFileRequest } from "@/types/shared.types";
import { IBalanceSheetFile } from "@/app/app/balance-sheet/_types/types";
import { parseCookies, setCookie } from "nookies";
import { getNewAccessToken } from "@/utils/getRefreshToken";
// import { parseCookies } from "nookies";


const baseQueryWithAuth: BaseQueryFn = async (args, api, extraOptions) => {
  const cookies = parseCookies();
  const accessToken = cookies?.asAccessToken;
  if (!accessToken) {
    const refreshToken = cookies.asRefreshToken; 
    const tokenResponse = (await getNewAccessToken(refreshToken as string));
    if (tokenResponse) {
      setCookie(null, "asAccessToken", tokenResponse.access_token, { path: "/", maxAge: (60 * 60) });
      return { error: { status: 200, data: "New access token created" } }
    } else {
      return { error: { status: 400, data: "Unable to generate access token" } }
    }
  }
  const baseQuery = fetchBaseQuery({ baseUrl: GLOBAL_BASEURL });
  return baseQuery(args, api, extraOptions);
};

const api = createApi({
  reducerPath: "commonApis",
  tagTypes: [ "files" ],
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    createFile: builder.mutation<any, ICreateFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file",
        method: "POST",
        body: formData
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),

    getFile: builder.query({
      query: (fileId: string) => `api/google-drive/file?fileId=${fileId}`,
    }),

    getFiles: builder.query<IBalanceSheetFile[], string>({
      query: (folderName: string) => `api/google-drive/folder?folderName=${folderName}`,
      providesTags: () => [{ type: "files" }]
    }),

    saveFile: builder.mutation<any, IUpdateFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file",
        method: "PATCH",
        body: formData
      })
    }),

    updateFileName: builder.mutation<any, { fileId: string, fileName: string }>({
      query: (formData) => ({
        url: "api/google-drive/folder",
        method: "POST",
        body: formData
      })
    }),
    
    deleteFile: builder.mutation<any, string>({
      query: (fileId: string) => ({
        url: `api/google-drive/file?fileId=${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),
    
  })
})

export default api;