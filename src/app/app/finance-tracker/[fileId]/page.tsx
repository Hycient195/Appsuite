import { readFile } from "@/services/googleDriveService";
import BalanceSheet from "./BalanceSheet";
import { cookies } from "next/headers";
import { getNewAccessToken } from "@/utils/getRefreshToken";
import { IFinanceTrackerDocument } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  const appCookies = (await cookies());
  const isLoggedIn = !!appCookies.get("asAccessToken")?.value;

  let csvString: IFinanceTrackerDocument = {
    templateLayout: "CLASSIC",
    filename: "",
  };
  let loadedSucessfully = false;

  try {
    // if (!isLoggedIn) {
    //   const refreshToken = appCookies.get("asRefreshToken")?.value;
    //   if (refreshToken && refreshToken !== "DUMMY_PREVIEW_REFRESH_TOKEN") {
    //     const tokenResponse = (await getNewAccessToken(refreshToken as string));
    //     appCookies.set("asAccessToken", tokenResponse?.access_token as string, { maxAge: (60*60)})
    //   }
    // }
    csvString = (await readFile((await params).fileId)) as IFinanceTrackerDocument;
    console.log(csvString)
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching balance sheet`, error);
    // csvString = {};
  }

  return <BalanceSheet csvString={csvString} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}