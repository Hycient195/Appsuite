import {  createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import GLOBAL_BASEURL from "./_globalBaseURL";
import { ICreateFileRequest, IUpdateFileRequest } from "@/types/shared.types";
import { IBalanceSheetFile } from "@/app/app/balance-sheet/_types/types";
// import { parseCookies } from "nookies";


const api = createApi({
  reducerPath: "commonApis",
  tagTypes: [ "files" ],
  baseQuery: fetchBaseQuery({
    baseUrl: GLOBAL_BASEURL,
    
    // headers: {
    //   Authorization:`Bearer ${parseCookies().pftoken}`
    // }
  }),
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