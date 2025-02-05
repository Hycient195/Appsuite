import { readFile } from "@/services/googleDriveService";
import InvoiceManager from "./InvoiceManager";
import { defaultGlobalInvoice } from "../_templates/globalDummyData";
import { IGlobalInvoice } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

interface IResponse {
  fileName: string;
  fileId?: string,
  folderId?: string;
  content: IGlobalInvoice
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  let invoiceData: IGlobalInvoice = { ...defaultGlobalInvoice };

  let response: IResponse = {
    fileName: "",
    content: invoiceData
  };
  let loadedSucessfully = false;

  try {
    response = (await readFile((await params).fileId)) as IResponse;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching balance sheet`, error);
  }

  return <InvoiceManager
    jsonData={typeof response.content === "string" ? JSON.parse(response.content) : response.content}
    fileName={response.fileName}
    folderId={response.folderId as string}
    loadedSucessfully={loadedSucessfully}
  />
}