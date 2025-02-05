import { readFile } from "@/services/googleDriveService";
import CGPATracker from "./GradesTracker";
import { IGradesTrackerDocument } from "../_types/types";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

interface IResponse {
  fileName: string;
  fileId?: string,
  folderId?: string;
  content: IGradesTrackerDocument
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  let response: IResponse = {
    fileName: "",
    content:  {
      cgpaScale: "OVER5",
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
    console.log(`Error fetching Grades Tracker sheet`, error);
  }

  return <CGPATracker
    csvString={typeof response.content === "string" ? JSON.parse(response.content) : response.content}
    folderId={response?.folderId as string}
    fileName={response?.fileName}
    loadedSucessfully={loadedSucessfully}
  />
}