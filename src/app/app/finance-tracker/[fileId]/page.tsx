
import BalanceSheet from "./BalanceSheet";
import { IPage, IRow } from "../_types/types";
import { readFile } from "@/services/googleDriveService";
import { convertToPages, parseCSV } from "@/utils/miscelaneous";
import { cookies } from "next/headers";

interface IProps {
  params: Promise<{
    fileId: string
  }>
}

export default async function BalanceSheetServerPage({ params }: IProps) {
  const appCookies = (await cookies());
  const isLoggedIn = !!appCookies.get("asAccessToken")?.value;

  const defaultRow: IRow = {
    date: '',
    narration: '',
    credit: "",
    debit: "",
    balance: 0,
  };
  
  const defaultPage: IPage = {
    title: "",
    subTitle: "",
    rows: [{ ...defaultRow }],
    totalCredit: 0,
    totalDebit: 0,
    finalBalance: 0,
    rowsToAdd: 1
  };

  // let pages: IPage[] = [ { ...defaultPage } ]
  let csvString = "";
  let loadedSucessfully = false;

  try {
    csvString = (await readFile((await params).fileId)) as string;
    // pages = convertToPages(parseCSV(decodedPageString as string));
    loadedSucessfully = true;
  } catch (error) {
    console.log(`Error fetching products`, error);
    csvString = "";
    // pages = [ { ...defaultPage } ]
  }

  return <BalanceSheet csvString={csvString} isLoggedIn={isLoggedIn} loadedSucessfully={loadedSucessfully} />
}