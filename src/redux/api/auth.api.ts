import {  createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import GLOBAL_BASEURL from "./_globalBaseURL";
import { parseCookies } from "nookies";


const api = createApi({
  reducerPath: "authApis",
  baseQuery: fetchBaseQuery({
    baseUrl: GLOBAL_BASEURL,
    headers: {
      Authorization:`Bearer ${parseCookies().pftoken}`
    }
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (formData) => ({
        url: "users",
        method: "POST",
        body: formData
      })
    }),
    signIn: builder.mutation({
      query: (formData) => ({
        url: "auth/login",
        method: "POST",
        body: formData
      }),
    }),
    sendEmailToken: builder.mutation({
      query: (formData) => ({
        url: "auth/verification/send-email-token",
        method: "POST",
        body: formData
      })
    }),
    confirmEmailToken: builder.mutation({
      query: (formData) => ({
        url: "auth/verification/confirm-email-token",
        method: "POST",
        body: formData
      })
    }),
  })
})

export default api;