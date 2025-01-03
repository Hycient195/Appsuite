import { ILoggedInUser } from "@/types/shared.types";
import { parseCookies } from "nookies";

export const isLoggedIn = !!parseCookies()?.asAccessToken;

export const loggedInUser = (parseCookies()?.asUserProfile ? JSON.parse(parseCookies()?.asUserProfile) : null) as ILoggedInUser;