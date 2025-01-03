export interface IRow {
  date: string;
  narration: string;
  credit: string;
  debit: string;
  balance: string;
}

export interface IBalanceSheetPage {
  title: string;
  subTitle: string;
  rows: IRow[];
  totalCredit: string;
  totalDebit: string;
  finalBalance: string;
  rowsToAdd: number;
  imageUrl?: string;
  templateLayout?: "CLASSIC" | "MODERN"
}

export interface IBalanceSheetFile {
  id: string;
  name: string;
  size: number;
  mimeType: string
}