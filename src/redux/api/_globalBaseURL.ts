import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { parseCookies } from "nookies";

// const GLOBAL_BASEURL = "https://localmaps-backend.onrender.com/api/v1/";
// const GLOBAL_BASEURL = import.meta.env.DEV ? "https://dev.localmaps.io/api/v1/" : "http://127.0.0.1:3000/api/v1/";
// const GLOBAL_BASEURL = "https://dev.localmaps.io/api/v1/";
const GLOBAL_BASEURL = "/";

export default GLOBAL_BASEURL;

export const globalApiConstructor = (reducerPath: string) => {
  return {
    reducerPath: reducerPath,
    baseQuery: fetchBaseQuery({
      baseUrl: GLOBAL_BASEURL,
      headers: {
        Authorization:`Bearer ${parseCookies().pftoken}`
      }
    }),
  }
}