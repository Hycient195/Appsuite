export interface IRow {
  date: string;
  narration: string;
  credit: string;
  debit: string;
  balance: number;
}

export interface IPage {
  title: string;
  subTitle: string;
  rows: IRow[];
  totalCredit: number;
  totalDebit: number;
  finalBalance: number;
  rowsToAdd: number;
}

export interface IBalanceSheetFile {
  id: string;
  name: string;
  size: number;
  mimeType: string
}