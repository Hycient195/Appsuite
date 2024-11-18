import { readFile } from "@/services/googleDriveService";
import { cookies } from "next/headers";
import { getNewAccessToken } from "@/utils/getRefreshToken";
import InvoiceManager from "./InvoiceManager";
import { defaultGlobalInvoice } from "../_templates/globalDummyData";
import { IGlobalInvoice } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  const appCookies = (await cookies());
  const isLoggedIn = !!appCookies.get("asAccessToken")?.value;

  let csvString: IGlobalInvoice = defaultGlobalInvoice;
  let loadedSucessfully = false;

  try {
    // if (!isLoggedIn) {
    //   const refreshToken = appCookies.get("asRefreshToken")?.value;
    //   if (refreshToken && refreshToken !== "DUMMY_PREVIEW_REFRESH_TOKEN") {
    //     const tokenResponse = (await getNewAccessToken(refreshToken as string));
    //     appCookies.set("asAccessToken", tokenResponse?.access_token as string, { maxAge: (60*60)})
    //   }
    // }
    csvString = (await readFile((await params).fileId)) as IGlobalInvoice;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching balance sheet`, error);
    // csvString = "";
  }

  return <InvoiceManager jsonData={csvString} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}