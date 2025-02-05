import { readFile } from "@/services/googleDriveService";
import ReceiptTracker from "./ReceiptTracker";
import { cookies } from "next/headers";
import { IReceiptTrackerDocument } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

interface IResponse {
  fileName: string;
  fileId?: string,
  folderId?: string;
  content: IReceiptTrackerDocument
}

export default async function ReceiptTrackerServerPage({ params }: IProps) {
  let response: IResponse = {
    fileName: "",
    content:  {
      templateLayout: "CLASSIC",
      filename: "",
      pages: []
    }
  };

  let loadedSucessfully = false;

  try {
    response = (await readFile((await params).fileId)) as IResponse;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching receipt tracker sheet`, error);
  }

  return <ReceiptTracker
    csvString={typeof response.content === "string" ? JSON.parse(response.content) : response.content}
    fileName={response.fileName}
    folderId={response.folderId as string}
    loadedSucessfully={loadedSucessfully}
  />
}