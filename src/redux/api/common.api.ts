import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import GLOBAL_BASEURL from "./_globalBaseURL";
import { ICreateFileRequest, IFileVersions, ILoggedInUser, IRenameFolderAndPrimaryFileRequest, IUpdateFileRequest, IUploadFileRequest, TMimeTypes } from "@/types/shared.types";
import { IBalanceSheetFile } from "@/app/app/finance-tracker/_types/types";
import { parseCookies, setCookie } from "nookies";
import { getNewAccessToken } from "@/utils/getRefreshToken";
import { getFoldersWithPrimaryFile, updateFile } from "@/services/googleDriveService";
// import { parseCookies } from "nookies";


const baseQueryWithAuth: BaseQueryFn = async (args, api, extraOptions) => {
  const cookies = parseCookies();
  const accessToken = cookies?.asAccessToken;
  if (!accessToken) {
    const refreshToken = cookies.asRefreshToken;
    if (refreshToken && refreshToken !== "DUMMY_PREVIEW_REFRESH_TOKEN") {
      const tokenResponse = (await getNewAccessToken(refreshToken as string));
      if (tokenResponse) {
        setCookie(null, "asAccessToken", tokenResponse.access_token, { path: "/", maxAge: (60 * 60) });
        return { error: { status: 200, data: "New access token created" } }
      } else {
        return { error: { status: 400, data: "Unable to generate access token" } }
      }
    }
  }
  const baseQuery = fetchBaseQuery({ baseUrl: GLOBAL_BASEURL });
  return baseQuery(args, api, extraOptions);
};


// const baseQuery = fetchBaseQuery({ baseUrl: GLOBAL_BASEURL });

// async function getAccessToken(): Promise<string | null> {
//   const cookies = parseCookies();
//   let accessToken = cookies.asAccessToken;

//   if (!accessToken) {
//     const refreshToken = cookies.asRefreshToken;
//     if (refreshToken) {
//       const tokenResponse = await getNewAccessToken(refreshToken);
//       if (tokenResponse) {
//         accessToken = tokenResponse.access_token;
//         setCookie(null, "asAccessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60, // 1 hour in seconds
//         });
//       } else {
//         throw new Error("Unable to generate access token");
//       }
//     } else {
//       throw new Error("No refresh token available");
//     }
//   }

//   return accessToken;
// }

// const baseQueryWithAuth: BaseQueryFn = async (args, api, extraOptions) => {
//   try {
//     const cookies = parseCookies();
//   let accessToken = cookies.asAccessToken;
//     console.log("Fired")
//     console.log(accessToken)
//     if (accessToken) {

//       // Pass the modified headers to the base queryreturn baseQuery(args, api, extraOptions);
//       return baseQuery(args, api, extraOptions);
//     } else {
//       // If we somehow have no access token, return an error
//       return { error: { status: 403, data: "Access token missing" } };
//     }
//   } catch (error: any) {
//     console.log("error Fired")
//     // Handle any errors that occur during the token retrieval
//     return { error: { status: 400, data: error?.message } };
//   }
// };

const api = createApi({
  reducerPath: "commonApis",
  tagTypes: [ "files", "user", "fileVersions" ],
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    signInUser: builder.mutation<any, ILoggedInUser>({
      query: (formData) => ({
        url: "api/user/sign-in",
        method: "POST",
        body: formData
      }),
      invalidatesTags: () => [{ type: "user" }]
    }),

    createFile: builder.mutation<any, ICreateFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file",
        method: "POST",
        body: formData
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),

    createFileInFolder: builder.mutation<any, ICreateFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file-in-folder",
        method: "POST",
        body: formData
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),

    saveFileInFileFolder: builder.mutation<{ id: string, url: string }, IUploadFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file-in-folder",
        method: "PUT",
        body: formData
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),

    getFile: builder.query({
      query: (fileId: string) => `api/google-drive/file?fileId=${fileId}`,
    }),

    getFoldersWithPrimaryFile: builder.query<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>, { folderName: string, primaryFileMimeType: TMimeTypes }>({
      query: ({ folderName, primaryFileMimeType }) => `api/google-drive/file-in-folder?folderName=${folderName}&primaryFileMimeType=${primaryFileMimeType}`,
      providesTags: () => [{ type: "files" }]
    }),

    getFiles: builder.query<IBalanceSheetFile[], string>({
      query: (folderName: string) => `api/google-drive/folder?folderName=${folderName}`,
      providesTags: () => [{ type: "files" }]
    }),

    saveFile: builder.mutation<Awaited<ReturnType<typeof updateFile>>, IUpdateFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file",
        method: "PATCH",
        body: formData,
      }),
    }),

    updateFileName: builder.mutation<any, { fileId: string, fileName: string }>({
      query: (formData) => ({
        url: "api/google-drive/folder",
        method: "POST",
        body: formData,
      }),
    }),

    renameFolderAndPrimaryFile: builder.mutation<any, IRenameFolderAndPrimaryFileRequest>({
      query: (formData) => ({
        url: "api/google-drive/file-in-folder",
        method: "PATCH",
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

    deleteFolderAllFilesInFolder: builder.mutation<any, string>({
      query: (folderId: string) => ({
        url: `api/google-drive/folder?folderId=${folderId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "files" }]
    }),
    
    getFileVersions: builder.query<IFileVersions[], string>({
      query: (fileId: string) => `api/google-drive/file-version?fileId=${fileId}`,
      providesTags: () => [{ type: "fileVersions" }]
    }),

    restoreFileVersion: builder.mutation<any, { fileId: string, revisionId: string, mimeType: TMimeTypes }>({
      query: (formData) => ({
        url: "api/google-drive/file-version",
        method: "POST",
        body: formData
      })
    }),
    
    uploadImage: builder.mutation<any, { fileId: string, fileName: string }>({
      query: (formData) => ({
        url: "api/google-drive/image",
        method: "POST",
        body: formData
      })
    }),

    exportPdfOnServer: builder.mutation<any, { exportNode: HTMLElement | null, fileName: string }>({
      queryFn: async ({ exportNode, fileName }) => {
        if (!exportNode) return { error: { message: "No export node provided" } };
    
        const htmlContent = exportNode.outerHTML;
    
        try {
          // const response = await fetch("/api/export-pdf", {
          const response = await fetch("/api/export-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: htmlContent }),
          });

          // console.log(response)
    
          if (!response.ok) {
            return { error: { message: "PDF export failed" } };
          }
    
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName ? `${fileName?.split(".")[0]}.pdf` : "export.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
    
          return { data: { message: "Download sucessful!"} }; // Returning void
        } catch (error) {
          return { error: { message: "An error occurred while exporting PDF" } };
        }
      },
    }),

  })
})

export default api;