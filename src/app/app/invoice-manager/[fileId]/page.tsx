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

  let invoiceData: IGlobalInvoice = defaultGlobalInvoice;
  let loadedSucessfully = false;

  try {
    invoiceData = (await readFile((await params).fileId)) as IGlobalInvoice;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching balance sheet`, error);
  }

  return <InvoiceManager jsonData={invoiceData} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}