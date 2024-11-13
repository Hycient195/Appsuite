import { readFile } from "@/services/googleDriveService";
import ReceiptTracker from "./ReceiptTracker";
import { cookies } from "next/headers";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

export default async function ReceiptTrackerServerPage({ params }: IProps) {
  const appCookies = (await cookies());
  const isLoggedIn = !!appCookies.get("asAccessToken")?.value;

  let csvString = "";
  let loadedSucessfully = false;

  try {
    csvString = (await readFile((await params).fileId)) as string;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching receipt tracker sheet`, error);
    csvString = "";
  }

  return <ReceiptTracker csvString={csvString} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}