import BalanceSheet from "./BalanceSheet";
import { readFile } from "@/services/googleDriveService";
import { cookies } from "next/headers";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  const appCookies = (await cookies());
  const isLoggedIn = !!appCookies.get("asAccessToken")?.value;

  let csvString = "";
  let loadedSucessfully = false;

  try {
    csvString = (await readFile((await params).fileId)) as string;
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching products`, error);
    csvString = "";
  }

  return <BalanceSheet csvString={csvString} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}