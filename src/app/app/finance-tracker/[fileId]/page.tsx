import { readFile } from "@/services/googleDriveService";
import FinanceTracker from "./FinanceTracker";
import { cookies } from "next/headers";
import { getNewAccessToken } from "@/utils/getRefreshToken";
import { IFinanceTrackerDocument } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

interface IResponse {
  fileName: string;
  fileId?: string,
  folderId?: string;
  content: IFinanceTrackerDocument
}

export default async function FinanceTrackerServerPage({ params }: IProps) {
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
    console.log(`Error fetching Finance Tracker sheet`, error);
  }

  return <FinanceTracker
    csvString={typeof response.content === "string" ? JSON.parse(response.content) : response.content}
    fileName={response.fileName}
    folderId={response.folderId as string}
    loadedSucessfully={loadedSucessfully}
  />
}