export interface IRow {
  date: string;
  narration: string;
  credit: string;
  debit: string;
  balance: string;
}

export interface IPage {
  title: string;
  subTitle: string;
  rows: IRow[];
  totalCredit: string;
  totalDebit: string;
  finalBalance: string;
  rowsToAdd: number;
}

export interface IBalanceSheetFile {
  id: string;
  name: string;
  size: number;
  mimeType: string
}